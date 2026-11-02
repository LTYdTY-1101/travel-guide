from pathlib import Path
import sys,os,json,wave,audioop
sys.path.insert(0,'/private/tmp/travel-audio-tools')
os.environ['HF_HOME']='/private/tmp/travel-reference-model-cache'
os.environ['HF_HUB_DISABLE_XET']='1'
os.environ['HF_HUB_OFFLINE']='1'
import numpy as np
from faster_whisper import WhisperModel
root=Path(__file__).resolve().parents[1]
model=WhisperModel('tiny',device='cpu',compute_type='int8',download_root='/private/tmp/travel-reference-model-cache')
with wave.open(str(root/'previews/six-stop-reference/source.wav')) as reader:
 raw=reader.readframes(reader.getnframes())
raw=audioop.tomono(raw,2,.5,.5)
raw,_=audioop.ratecv(raw,2,1,44100,16000,None)
audio=np.frombuffer(raw,'<i2').astype(np.float32)/32768
results=[]
for name,start,end in [('whole',0,29.7),('selected-phrase',13.725351,21.657324)]:
 segments,info=model.transcribe(audio[round(start*16000):round(end*16000)],beam_size=3,vad_filter=True,condition_on_previous_text=False,no_speech_threshold=.5)
 items=[dict(start=s.start+start,end=s.end+start,text=s.text,noSpeechProbability=s.no_speech_prob,averageLogProbability=s.avg_logprob) for s in segments]
 results.append(dict(name=name,language=info.language,languageProbability=info.language_probability,vadSpeechSeconds=info.duration_after_vad,segments=items))
 print(name,items,flush=True)
(root/'previews/six-stop-reference/speech-audit.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))
