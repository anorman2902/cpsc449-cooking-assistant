# Recipe Images

This directory contains recipe images for the application.

For complete documentation on image handling, see:
[Image Handling Documentation](/docs/image-handling.md)

Key points:
1. Name images using the recipe UUID: `recipe-[uuid].jpg`
2. Store only the filename in the database's `image_url` field
3. Backend will automatically convert to full URLs for the frontend 

## Current Images
- `recipe-e45a6b20-dc93-414a-b9a5-8a9b3f5dcfa1.jpg` - Spaghetti Carbonara
- `recipe-f67b4c31-ef54-425a-8cbc-9ab12d8f4b02.jpg` - French Toast
- `recipe-a2b4c6d8-e0f2-4681-9a3c-5b7d8e9f1234.jpg` - Chicken Stir Fry
- `recipe-b3c5d7e9-f1a3-5792-0b4d-6e8f0a1b2c3d.jpg` - Chocolate Chip Cookies
- `recipe-c4d6e8f0-a2b4-6803-1c5d-7e9f0a1b2c3d.jpg` - Classic Caesar Salad

## Image Specifications
- **Format**: JPG or PNG
- **Recommended Dimensions**: 1200×800 pixels
- **Maximum File Size**: 2MB
- **Aspect Ratio**: 3:2 (landscape)