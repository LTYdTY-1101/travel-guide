"""Local MDX-Net accompaniment inference. NumPy STFT, original sample clock.
Model metadata: TRvlvr/application_data mdx_model_data, hash 55657dd7...711.
"""
from pathlib import Path
import sys,wave,json
sys.path.insert(0,'/private/tmp/travel-audio-tools')
import numpy as np
import onnxruntime as ort
root=Path(__file__).resolve().parents[1];folder=root/'previews/six-stop-reference'
with wave.open(str(folder/'source.wav')) as r:
 sr=r.getframerate();full=np.frombuffer(r.readframes(r.getnframes()),'<i2').reshape(-1,2).astype(np.float32)/32768
start,end=round(12*sr),round(23*sr);audio=full[start:end].T.copy()
nfft,hop,dimf,dimt=6144,1024,3072,256
trim=nfft//2;size=hop*(dimt-1);gen=size-2*trim
window=np.hanning(nfft+1)[:-1].astype(np.float32)
options=ort.SessionOptions();options.intra_op_num_threads=4
session=ort.InferenceSession('/private/tmp/travel-separator/mdx-net/UVR-MDX-NET-Inst_HQ_3.onnx',sess_options=options,providers=['CPUExecutionProvider'])
pad=gen-audio.shape[-1]%gen
padded=np.pad(audio,((0,0),(trim,pad+trim)))
outputs=[]
for i in range(0,audio.shape[-1]+pad,gen):
 chunk=padded[:,i:i+size];centered=np.pad(chunk,((0,0),(trim,trim)),mode='reflect')
 frames=np.lib.stride_tricks.sliding_window_view(centered,nfft,axis=-1)[:,::hop,:]
 spectrum=np.fft.rfft(frames*window,axis=-1)
 tensor=np.stack([spectrum.real,spectrum.imag],axis=1).reshape(4,dimt,nfft//2+1).transpose(0,2,1)[None,:,:dimf,:].astype(np.float32)
 prediction=session.run(None,{'input':tensor})[0][0]
 prediction=np.pad(prediction,((0,0),(0,1),(0,0))).reshape(2,2,nfft//2+1,dimt)
 complex_spectrum=(prediction[:,0]+1j*prediction[:,1]).transpose(0,2,1)
 restored=np.fft.irfft(complex_spectrum,n=nfft,axis=-1)*window
 signal=np.zeros((2,(dimt-1)*hop+nfft));norm=np.zeros(signal.shape[-1])
 for j in range(dimt):signal[:,j*hop:j*hop+nfft]+=restored[:,j];norm[j*hop:j*hop+nfft]+=window**2
 signal/=np.maximum(norm,1e-9);signal=signal[:,trim:-trim]
 outputs.append(signal[:,trim:-trim]);print('Separated chunk',i//gen+1,flush=True)
clean=np.concatenate(outputs,axis=-1)[:,:audio.shape[-1]].T*1.022
full[start:end]=clean.astype(np.float32)
np.save(folder/'instrumental.npy',full)
with wave.open(str(folder/'instrumental-review.wav'),'wb') as w:
 w.setnchannels(2);w.setsampwidth(2);w.setframerate(sr);w.writeframes(np.clip(clean*.8*32767,-32768,32767).astype('<i2').tobytes())
report=dict(model='UVR-MDX-NET-Inst_HQ_3',modelHash='55657dd70583b0fedfba5f67df11d711',nfft=nfft,dimf=dimf,dimt=dimt,sampleRate=sr,processedSourceSeconds=[12,23],inputRMS=float(np.sqrt((audio**2).mean())),instrumentalRMS=float(np.sqrt((clean**2).mean())),residualRMS=float(np.sqrt(((audio.T-clean)**2).mean())),speed=1,pitchShift=0)
(folder/'separation-audit.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2))
