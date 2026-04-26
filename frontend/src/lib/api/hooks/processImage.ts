import { useMutation } from "@tanstack/react-query";
import { http } from "../http";
import axios from "axios";
import toast from "react-hot-toast";
import { ProcessAudio, SendEmail } from "@/validation/imageProcess";

export function useSentImage() {
    return useMutation({
        mutationKey: ["sentImage"],
        mutationFn: async (formData: FormData) => {
            const response = await http.post("/process-img", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            return response.data
        },
        onError: (error) => {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message ?? "Something went wrong"
                toast.error(message)
            } else {
                toast.error("Unexpected error occurred")
            }
        },
    })
}


export function useSentTextForAudio() {
    return useMutation({
        mutationKey: ["sentTextForAudio"],
        mutationFn: async (data: ProcessAudio) => {
            const response = await http.post("/audio", data, {
                responseType: "arraybuffer",
            })
            return response.data
        },
        onError: (error) => {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message ?? "Something went wrong"
                toast.error(message)
            } else {
                toast.error("Unexpected error occurred")
            }
        },
    })
}


export function useSentEmail() {
    return useMutation({
        mutationKey: ["sentEmail"],
        mutationFn: async (data: SendEmail) => {
            const response = await http.post("/email", data)
            return response.data
        },
        onError: (error) => {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message ?? "Something went wrong"
                toast.error(message)
            } else {
                toast.error("Unexpected error occurred")
            }
        },
    })
}