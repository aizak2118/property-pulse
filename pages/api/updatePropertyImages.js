// pages/api/updatePropertyImages.js
import mongoose from "mongoose";
import Property from "@/models/Property";
import connectDB from "@/config/database";

connectDB();

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      // Cloudinaryの画像リストを取得
      const imageResponse = await fetch(
        `${process.env.BASE_URL}/api/fetchImages`
      );
      const imageData = await imageResponse.json();
      console.log("Fetched images:", imageData);

      // Cloudinaryの画像リストをオブジェクトとして変換
      const imageMap = imageData.reduce((map, image) => {
        const filename = image.public_id.split("/").pop(); // Cloudinaryのpublic_idからファイル名を抽出
        map[filename] = image.url;
        return map;
      }, {});
      console.log("Image map:", imageMap);

      // MongoDBのプロパティを取得し、画像URLを更新
      const properties = await Property.find();
      console.log("Properties before update:", properties);

      for (const property of properties) {
        const updatedImages = property.images.map((img) => {
          const filename = img.split("/").pop(); // MongoDBの画像URLからファイル名を抽出
          return imageMap[filename] || img; // CloudinaryのURLに置き換える
        });

        const result = await Property.findByIdAndUpdate(property._id, {
          $set: { images: updatedImages },
        });
        console.log(`Updated property ${property._id}:`, result);
      }

      res
        .status(200)
        .json({ message: "Properties updated with Cloudinary images." });
    } catch (error) {
      console.error("Error updating properties:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
