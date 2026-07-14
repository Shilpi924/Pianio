import { db } from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot,
  addDoc,
  updateDoc
} from 'firebase/firestore';

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

class WebRTCService {
  private pc: RTCPeerConnection | null = null;
  private dataChannel: RTCDataChannel | null = null;
  
  public onStatusChange: (status: ConnectionStatus) => void = () => {};
  public onMessage: (msg: string) => void = () => {};

  private readonly iceServers = {
    iceServers: [
      {
        urls: [
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
        ],
      },
    ],
    iceCandidatePoolSize: 10,
  };

  private initPC() {
    this.pc = new RTCPeerConnection(this.iceServers);
    
    this.pc.onconnectionstatechange = () => {
      console.log("Connection state:", this.pc?.connectionState);
      if (this.pc?.connectionState === 'connected') {
        this.onStatusChange('connected');
      } else if (this.pc?.connectionState === 'disconnected' || this.pc?.connectionState === 'failed') {
        this.onStatusChange('disconnected');
        this.disconnect();
      }
    };
  }

  private setupDataChannel(channel: RTCDataChannel) {
    this.dataChannel = channel;
    this.dataChannel.onopen = () => {
      console.log('Data channel opened');
      this.onStatusChange('connected');
    };
    this.dataChannel.onmessage = (e) => {
      this.onMessage(e.data);
    };
    this.dataChannel.onclose = () => {
      console.log('Data channel closed');
      this.onStatusChange('disconnected');
    };
  }

  public async createRoom(): Promise<string> {
    this.onStatusChange('connecting');
    
    // Generate a simple 4-character room ID
    const roomId = Math.random().toString(36).substring(2, 6).toUpperCase();
    const roomRef = doc(db, 'rooms', roomId);
    const callerCandidatesCollection = collection(roomRef, 'callerCandidates');
    const calleeCandidatesCollection = collection(roomRef, 'calleeCandidates');

    this.initPC();

    // Create Data Channel
    const dataChannel = this.pc!.createDataChannel('midi-events');
    this.setupDataChannel(dataChannel);

    // Collect ICE candidates
    this.pc!.onicecandidate = async (event) => {
      if (event.candidate) {
        await addDoc(callerCandidatesCollection, event.candidate.toJSON());
      }
    };

    // Create Offer
    const offer = await this.pc!.createOffer();
    await this.pc!.setLocalDescription(offer);

    const roomWithOffer = {
      offer: {
        type: offer.type,
        sdp: offer.sdp,
      },
    };
    await setDoc(roomRef, roomWithOffer);

    // Listen for Answer
    onSnapshot(roomRef, (snapshot) => {
      const data = snapshot.data();
      if (!this.pc!.currentRemoteDescription && data?.answer) {
        const rtcSessionDescription = new RTCSessionDescription(data.answer);
        this.pc!.setRemoteDescription(rtcSessionDescription);
      }
    });

    // Listen for remote ICE candidates
    onSnapshot(calleeCandidatesCollection, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const data = change.doc.data();
          this.pc!.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });

    return roomId;
  }

  public async joinRoom(roomId: string) {
    this.onStatusChange('connecting');
    const roomRef = doc(db, 'rooms', roomId);
    const roomSnapshot = await getDoc(roomRef);

    if (!roomSnapshot.exists()) {
      this.onStatusChange('error');
      throw new Error(`Room ${roomId} does not exist.`);
    }

    this.initPC();

    const callerCandidatesCollection = collection(roomRef, 'callerCandidates');
    const calleeCandidatesCollection = collection(roomRef, 'calleeCandidates');

    // Wait for Data Channel
    this.pc!.ondatachannel = (event) => {
      this.setupDataChannel(event.channel);
    };

    // Collect ICE candidates
    this.pc!.onicecandidate = async (event) => {
      if (event.candidate) {
        await addDoc(calleeCandidatesCollection, event.candidate.toJSON());
      }
    };

    // Fetch offer and set remote description
    const offer = roomSnapshot.data().offer;
    await this.pc!.setRemoteDescription(new RTCSessionDescription(offer));

    // Create answer
    const answer = await this.pc!.createAnswer();
    await this.pc!.setLocalDescription(answer);

    const roomWithAnswer = {
      answer: {
        type: answer.type,
        sdp: answer.sdp,
      },
    };
    await updateDoc(roomRef, roomWithAnswer);

    // Listen for remote ICE candidates
    onSnapshot(callerCandidatesCollection, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const data = change.doc.data();
          this.pc!.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
  }

  public sendMessage(msg: string) {
    if (this.dataChannel && this.dataChannel.readyState === 'open') {
      this.dataChannel.send(msg);
    }
  }

  public disconnect() {
    if (this.dataChannel) {
      this.dataChannel.close();
      this.dataChannel = null;
    }
    if (this.pc) {
      this.pc.close();
      this.pc = null;
    }
    this.onStatusChange('disconnected');
  }
}

export const webrtcService = new WebRTCService();
