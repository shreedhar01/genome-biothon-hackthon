from transformers import VitsModel, AutoTokenizer
import torch
import numpy as np
import scipy.io.wavfile as wavfile
import io
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "..", "models", "saved_nepali_tts_model")

model = VitsModel.from_pretrained(MODEL_PATH)
tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
model.eval()

def split_nepali_sentences(text: str):
    sentences = text.replace("।", "।|").split("|")
    return [s.strip() for s in sentences if s.strip()]

def synthesize_audio(text: str) -> io.BytesIO:
    sentences = split_nepali_sentences(text)
    
    silence = np.zeros(int(model.config.sampling_rate * 0.3))
    all_audio = []

    for sentence in sentences:
        inputs = tokenizer(sentence, return_tensors="pt")
        with torch.no_grad():
            output = model(**inputs).waveform
        audio = output.squeeze().cpu().numpy()
        all_audio.append(audio)
        all_audio.append(silence)

    final_audio = np.concatenate(all_audio)

    # normalize
    max_val = np.max(np.abs(final_audio))
    if max_val > 0:
        final_audio = final_audio / max_val

    # int16 — same as notebook
    final_audio = (final_audio * 32767).astype(np.int16)

    buf = io.BytesIO()
    wavfile.write(buf, rate=model.config.sampling_rate, data=final_audio)
    buf.seek(0)
    return buf