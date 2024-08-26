// pages/api/fetchImages.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const cloudinaryApiUrl = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/resources/image`;

    const response = await fetch(cloudinaryApiUrl, {
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${process.env.CLOUDINARY_API_KEY}:${process.env.CLOUDINARY_API_SECRET}`).toString('base64')
      }
    });

    const data = await response.json();
    res.status(200).json(data.resources); // 画像リソースのリストを返す
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
