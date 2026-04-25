import fs from "fs"
import FormData from "form-data"
import { ProcessImage } from "../validators/processImage.validation";
import {http} from "../config/axiosApi"

export const processImageService = async (image: ProcessImage) => {
    const path = image?.image.path

    const form = new FormData()
    form.append("file", fs.createReadStream(path), {
        filename: image.image.originalname,
        contentType: image.image.mimetype,
    })

    const response = await http.post("/predict", form, {
        headers: form.getHeaders(),
    })
    // console.log(response)

    fs.unlink(path, () => { })

    return response.data
}