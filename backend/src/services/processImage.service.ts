import fs from "fs"
import FormData from "form-data"
import { ProcessAudio, ProcessImage } from "../validators/processImage.validation";
import {http} from "../config/axiosApi"

export const processImageService = async (image: ProcessImage) => {
    const path = image?.image.path

    const form = new FormData()
    form.append("file", fs.createReadStream(path), {
        filename: image.image.originalname,
        contentType: image.image.mimetype,
    })

    const response = await http.post("/plant/predict", form, {
        headers: form.getHeaders(),
    })
    // console.log(response)

    fs.unlink(path, () => { })

    return response.data
}

export const processAudioService = async (data: ProcessAudio) => {
    const response = await http.post("/tts/synthesize", data, {
        responseType: "arraybuffer",
    });

    return response.data;
};