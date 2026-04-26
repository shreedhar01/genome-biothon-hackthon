# diagnose.py
import torch
import numpy as np
import scipy.io.wavfile as wavfile
import io
from transformers import VitsModel, AutoTokenizer

MODEL_PATH = "models/saved_nepali_tts_model"
model = VitsModel.from_pretrained(MODEL_PATH)
tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
model.eval()

text = "नमस्ते"
inputs = tokenizer(text, return_tensors="pt")

with torch.no_grad():
    output = model(**inputs).waveform

audio = output.squeeze().cpu().numpy()
print(f"1. Raw waveform — shape: {audio.shape}, min: {audio.min():.4f}, max: {audio.max():.4f}")

# normalize
audio = audio / np.max(np.abs(audio))
audio_int16 = (audio * 32767).astype(np.int16)
print(f"2. int16 — min: {audio_int16.min()}, max: {audio_int16.max()}, dtype: {audio_int16.dtype}")

# write to DISK first
wavfile.write("test_direct.wav", rate=model.config.sampling_rate, data=audio_int16)
print("3. Saved test_direct.wav")

# write to BytesIO and read back
buf = io.BytesIO()
wavfile.write(buf, rate=model.config.sampling_rate, data=audio_int16)
buf.seek(0)
raw_bytes = buf.read()
print(f"4. BytesIO size: {len(raw_bytes)} bytes")

# verify WAV header
print(f"5. WAV header magic: {raw_bytes[:4]}")  # should be b'RIFF'
print(f"6. WAV format: {raw_bytes[8:12]}")      # should be b'WAVE'

# save BytesIO output to disk too
with open("test_from_bytesio.wav", "wb") as f:
    f.write(raw_bytes)
print("7. Saved test_from_bytesio.wav")
print("\nNow run: aplay test_direct.wav")
print("And run: aplay test_from_bytesio.wav")