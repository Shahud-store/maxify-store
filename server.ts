import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import scrape from "aliexpress-product-scraper";
import { createClient } from "@supabase/supabase-js";
import puppeteer from "puppeteer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase Initialization
const supabaseUrl = process.env.SUPABASE_URL || "https://caesvqoqavszsgeppxmc.supabase.co";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "sb_publishable__ks0rjm5KOUCx2RIzWAzbw_42ggXaEh";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const app = express();
app.use(express.json());

async function startServer() {
  // API Routes
  app.post("/api/import-product", async (req, res) => {
    try {
      const { id, source } = req.body;
      
      if (!id) {
        return res.status(400).json({ error: "Product ID, URL, or SKU is required" });
      }

      console.log(`Input ID/URL/SKU: ${id} from source: ${source}`);

      if (source === "cj") {
        // CJ Dropshipping Logic
        return handleCJImport(id, res);
      }

      // Existing AliExpress Logic
      let productId = id.trim();
      if (productId.includes("aliexpress.com")) {
        const itemMatch = productId.match(/\/item\/(\d+)\.html/);
        const queryMatch = productId.match(/[?&]productIds=(\d+)/);
        
        if (itemMatch) {
          productId = itemMatch[1];
        } else if (queryMatch) {
          productId = queryMatch[1];
        }
      }

      console.log(`Resolved Product ID: ${productId}`);
      const product = await scrape(productId, {
        puppeteerOptions: {
          headless: true,
          args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-accelerated-2d-canvas",
            "--disable-gpu",
            "--window-size=1920,1080",
            "--disable-blink-features=AutomationControlled",
            "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
            "--lang=en-US,en;q=0.9",
          ],
          defaultViewport: {
            width: 1920,
            height: 1080
          }
        },
      });

      if (!product || !product.title) {
        console.error("Scraper returned null or empty product object:", product);
        throw new Error(`Failed to extract data for ${productId}. Anti-bot measures might be blocking access.`);
      }

      // Improved price extraction with margin
      let originalPrice = 0;
      const rawPrice = product.variants?.[0]?.price || product.price || "0";
      originalPrice = parseFloat(rawPrice.replace(/[^\d.]/g, ""));
      
      if (isNaN(originalPrice) || originalPrice === 0) {
        console.warn(`Price parsing failed for "${rawPrice}". Original price set to 0.`);
        originalPrice = 0;
      }

      const finalPrice = Math.round(originalPrice * 1.20);
      console.log(`Calculated Price: ${originalPrice} -> ${finalPrice} (20% margin)`);

      const productData = {
        title: product.title,
        price: finalPrice,
        image: product.images?.[0] || "",
        url: `https://www.aliexpress.com/item/${productId}.html`,
        description: product.description || ""
      };

      // Save to Supabase
      console.log("Saving to Supabase table 'products'...");
      const { data, error } = await supabase
        .from("products")
        .insert([productData])
        .select();

      if (error) {
        console.error("Full Supabase Error Object:", JSON.stringify(error, null, 2));
        let errorMessage = error.message;
        if (error.message.includes("schema cache") || error.message.includes("compare_at_price")) {
          errorMessage = "DATABASE ERROR: The 'compare_at_price' column is missing or schema is out of date. Please run this SQL in your Supabase SQL Editor: ALTER TABLE products ADD COLUMN compare_at_price NUMERIC;";
        }
        
        return res.status(500).json({ error: `Save failed: ${errorMessage}`, details: error });
      }

      res.json({ 
        success: true, 
        message: "Product imported and saved successfully", 
        data: data?.[0] || productData 
      });
    } catch (error) {
      console.error("Scraping failed:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to fetch product from AliExpress" });
    }
  });

  app.post("/api/manual-import", async (req, res) => {
    try {
      const { title, price, image, url, description, compare_at_price, source } = req.body;
      console.log(`Manual Import Request for: ${source || 'unknown'}`);
      
      if (!title || !price) {
        return res.status(400).json({ error: "Title and Price are required" });
      }

      const originalPriceInput = parseFloat(String(price).replace(/[^\d.]/g, ""));
      let originalPrice = originalPriceInput;
      
      // CJ uses USD, convert to PKR
      if (source === 'cj') {
        originalPrice = originalPriceInput * 280;
      }
      
      const finalPrice = Math.round(originalPrice * 1.20);
      
      // Handle Compare at Price logic
      let finalComparePrice = null;
      if (compare_at_price) {
        const compareAtPriceInput = parseFloat(String(compare_at_price).replace(/[^\d.]/g, ""));
        let compareAtPrice = compareAtPriceInput;
        if (source === 'cj') {
          compareAtPrice = compareAtPriceInput * 280;
        }
        finalComparePrice = Math.round(compareAtPrice);
      }

      const productData: any = {
        title,
        price: finalPrice,
        image: image || "",
        url: url || "",
        description: description || ""
      };

      if (finalComparePrice !== null) {
        productData.compare_at_price = finalComparePrice;
      }

      const { data, error } = await supabase
        .from("products")
        .insert([productData])
        .select();

      if (error) {
        console.error("Manual Supabase Save Error:", error);
        let msg = `Save failed: ${error.message}`;
        if (error.message.includes("compare_at_price")) {
          msg = "DATABASE ERROR: The 'compare_at_price' column is missing in your Supabase 'products' table. Please run this SQL in your Supabase SQL Editor: ALTER TABLE products ADD COLUMN compare_at_price NUMERIC;";
        }
        return res.status(500).json({ error: msg });
      }

      res.json({ success: true, message: "Manual product saved with 20% margin", data: data?.[0] });
    } catch (error) {
      res.status(500).json({ error: "Portal error during manual import" });
    }
  });

  app.get("/api/products", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      res.json({ success: true, data });
    } catch (error) {
      console.error("Fetch products failed:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  async function handleCJImport(id: string, res: any) {
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-blink-features=AutomationControlled",
        ]
      });
      const page = await browser.newPage();
      await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36");
      await page.setViewport({ width: 1920, height: 1080 });

      let targetUrl = id.trim();
      if (!targetUrl.startsWith("http")) {
        targetUrl = `https://cjdropshipping.com/product/search?keyword=${encodeURIComponent(id)}`;
      }

      console.log(`CJ Target URL: ${targetUrl}`);
      await page.goto(targetUrl, { waitUntil: "networkidle0", timeout: 45000 });

      if (targetUrl.includes("/search")) {
        console.log("On search page, looking for results...");
        await page.waitForSelector(".cj-product-item, .search-product-item", { timeout: 15000 }).catch(() => null);
        const firstProduct = await page.$(".cj-product-item, .search-product-item");
        if (firstProduct) {
          console.log("Found product item, clicking...");
          await Promise.all([
            firstProduct.click(),
            page.waitForNavigation({ waitUntil: "networkidle0", timeout: 45000 })
          ]);
        } else {
          const currentUrl = page.url();
          if (!currentUrl.includes("/product/")) {
             throw new Error(`Product SKU/ID "${id}" not found on CJ Dropshipping search.`);
          }
        }
      }

      console.log("On detail page, waiting for selectors...");
      const detailSelector = "h1, .product-detail-name, .product-name, .cj-product-title";
      await page.waitForSelector(detailSelector, { timeout: 30000 }).catch(async () => {
         const content = await page.content();
         console.log("Page Content Snippet (Failed Selector):", content.substring(0, 1000));
         throw new Error("Could not find product title. CJ might be blocking the request or the page is taking too long.");
      });
      
      const product = await page.evaluate(() => {
        const titleEl = document.querySelector("h1, .product-detail-name, .product-name, .cj-product-title");
        const priceEl = document.querySelector(".price, .product-detail-price, .cj-product-price, .product-price");
        const imgEl = document.querySelector(".product-detail-left img, .thumb-image img, .cj-image-magnifier img, .product-image img");
        const descEl = document.querySelector(".description-content, #description, .product-description, .pd-desc-content");

        return {
          title: titleEl?.textContent?.trim() || "",
          price: priceEl?.textContent?.trim() || "0",
          image: (imgEl as HTMLImageElement)?.src || "",
          description: descEl?.textContent?.trim() || ""
        };
      });

      if (!product.title) {
        throw new Error("Extracted product title is empty. CJ structure might have changed.");
      }

      console.log("Extracted Product:", product.title);

      let priceStr = product.price.split('-')[0]; 
      let originalPriceUSD = parseFloat(priceStr.replace(/[^\d.]/g, ""));
      if (isNaN(originalPriceUSD) || originalPriceUSD === 0) originalPriceUSD = 0;
      
      // Convert CJ USD to PKR
      const originalPricePKR = originalPriceUSD * 280;
      const finalPrice = Math.round(originalPricePKR * 1.20);

      console.log(`CJ Price Conversion: $${originalPriceUSD} -> Rs. ${originalPricePKR} -> Final: Rs. ${finalPrice}`);

      console.log("Saving CJ product to Supabase...");
      const productData: any = {
        title: product.title,
        price: finalPrice,
        image: product.image,
        url: page.url(),
        description: product.description.substring(0, 500)
      };

      // Only include compare_at_price if we had a way to fetch it or if we want to explicitly set it to null
      // For now, we omit it to avoid schema errors if the column doesn't exist yet
      // productData.compare_at_price = null; 

      const { data, error } = await supabase
        .from("products")
        .insert([productData])
        .select();

      if (error) {
        console.error("CJ Supabase Save Error:", error);
        let msg = `CJ Save failed: ${error.message}`;
        if (error.message.includes("schema cache") || error.message.includes("compare_at_price")) {
          msg = "DATABASE ERROR: The 'compare_at_price' column is missing or schema is out of date. Please run this SQL in your Supabase SQL Editor: ALTER TABLE products ADD COLUMN compare_at_price NUMERIC;";
        }
        throw new Error(msg);
      }

      console.log("CJ Product Saved Successfully");
      res.json({ success: true, message: "CJ Product imported successfully", data: data?.[0] || productData });

    } catch (error) {
      console.error("CJ Import failed:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "CJ Import failed" });
    } finally {
      if (browser) await browser.close();
    }
  }

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Export app for Vercel or listen locally
  if (process.env.VERCEL) {
    // Vercel handles the listening
  } else {
    const PORT = Number (process.env.PORT) || 3000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Maxify Server running on http://localhost:${PORT}`);
    });
  }
}

startServer();

export default app;
