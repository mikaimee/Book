// Creates and returns a promise that loads an image from given URL
// When promise resolves with loaded image wen it succcessfully loads or rejects
export const createImage = (url) => 
    new Promise((resolve, reject) => {
        const image = new Image()
        // Event listeners added to image to handle when it loads successfully or encounters error
        image.addEventListener("load", () => resolve(image))
        image.addEventListener("error", (error) => reject(error))
        // set to annoymous to avoid cross-origin issures
        image.setAttribute("crossOrigin", "annonymous")
        // set to provided URL
        image.src = url
    })

// Converts a degree value to radians
// Used to rotate images because rotation functions work with radians
export function getRadianAngle(degreeValue) {
    return (degreeValue * Math.PI) / 180
}

// Calculates the new boundig area (w,h) of a rotated rectangle based on its original width, height, and rotation angle
// Takes original width, height, rottation angle in degeres as parameters and returns object with new width and height
export function rotateSize(width, height, rotation) {
    const rotRad = getRadianAngle(rotation)
    return {
        width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
        height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height)
    }
}

// Main function for cropping and manipulating image
export default async function getCroppedImage (
    imageSrc,  // URL of source image
    pixelCrop,  // Object representing pixel-based crop area
    rotation,  // Rotation angle in degrees (default of 0)
    flip = { horizontal: false, vertical: false}  // An object specifying whther to flip the image horizontally or vertically
) {
    try {
        // Loads image
        const image = await createImage(imageSrc)
        // Create canvas and 2D context for image manipulation
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")

        if (!ctx) {
            throw new Error("Canvas context not supported")
        }

        // Calculates size of canvas needed to accomodate rotated image
        const rotRad = getRadianAngle(rotation)
        const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
            image.width,
            image.height,
            rotation
        )

        canvas.width = bBoxWidth
        canvas.height = bBoxHeight

        ctx.translate(bBoxWidth / 2, bBoxHeight / 2)
        ctx.rotate(rotRad)
        ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1)
        ctx.translate(-image.width / 2, -image.height / 2)

        // Draws the rotated and transformed image on canvas
        ctx.drawImage(image, 0, 0)

        // Extracts the cropped area from canvas
        const data = ctx.getImageData(
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height
        )

        canvas.width = pixelCrop.width
        canvas.height = pixelCrop.height

        ctx.putImageData(data, 0, 0)

        // Returns cropped image as Blob object along with URL fr display
        // URL revoked to prevent memory leaks
        return new Promise((resolve, reject) => {
            canvas.toBlob((file) => {
                const dataUrl = URL.createObjectURL(file)
                resolve({ url: dataUrl, file })
                URL.revokeObjectURL(dataUrl)
            })
        })
    }
    catch(error) {
        throw new Error(`Image cropping error: ${error.message}`)
    }
}