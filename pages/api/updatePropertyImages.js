// pages/api/updatePropertyImages.js
import mongoose from 'mongoose';
import Property from '@/models/Property';
import connectDB from '@/config/database';

connectDB();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Cloudinaryの画像リストを取得
    const imageResponse = await fetch(`${process.env.BASE_URL}/api/fetchImages`);
    const imageData = await imageResponse.json();

    // Cloudinaryの画像リストをオブジェクトとして変換
    const imageMap = imageData.reduce((map, image) => {
      const filename = image.public_id.split('/').pop(); // Cloudinaryのpublic_idからファイル名を抽出
      map[filename] = image.url;
      return map;
    }, {});

    // MongoDBのプロパティを取得し、画像URLを更新
    const properties = await Property.find();
    properties.forEach(async (property) => {
      const updatedImages = property.images.map(img => {
        const filename = img.split('/').pop(); // MongoDBの画像URLからファイル名を抽出
        return imageMap[filename] || img; // CloudinaryのURLに置き換える
      });

      await Property.findByIdAndUpdate(property._id, { $set: { images: updatedImages } });
    });

    res.status(200).json({ message: 'Properties updated with Cloudinary images.' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
