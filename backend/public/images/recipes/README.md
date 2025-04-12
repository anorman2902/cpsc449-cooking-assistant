# Recipe Images

This directory contains recipe images for the application.

For complete documentation on image handling, see:
[Image Handling Documentation](/docs/image-handling.md)

Key points:
1. Name images using the recipe UUID: `recipe-[uuid].jpg`
2. Store only the filename in the database's `image_url` field
3. Backend will automatically convert to full URLs for the frontend 