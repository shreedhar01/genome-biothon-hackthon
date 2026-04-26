from omnivoice import OmniVoice
import soundfile as sf
import torch
import io

SAMPLE_RATE = 24000
DEFAULT_INSTRUCT = "female, low pitch, indian accent"

model = OmniVoice.from_pretrained(
    "k2-fsa/OmniVoice",
    device_map="cuda:0" if torch.cuda.is_available() else "cpu",
    dtype=torch.float16,
    load_asr=False,
)

def synthesize_audio(text: str) -> io.BytesIO:
    audio = model.generate(text=text, instruct=DEFAULT_INSTRUCT)
    buf = io.BytesIO()
    sf.write(buf, audio[0], SAMPLE_RATE, format="WAV")
    buf.seek(0)
    return buf