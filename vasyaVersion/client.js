import React, { Component } from 'react';
import { Select, Button, Input, Tabs, message } from 'antd'

export default  class VideoCall extends React.Component{

    render(){
  
      return <div>
      <video id="sdgdsfgsgegrdsr" autoPlay></video>
        <Button
        onClick={async ()=>{
          try{
          let preview = document.getElementById('sdgdsfgsgegrdsr')
          console.log('onClick');
          let stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
          })
          console.log(stream);
          preview.srcObject = stream;
          console.log(stream.getVideoTracks()[0]);
          const peerConnection = new RTCPeerConnection({
            iceServers: [{"url":"stun:stun.l.google.com:19302"}],
          });
          peerConnection.connectionstatechange=()=>{
            console.log('connectionstatechange');
          }
          peerConnection.onicecandidate = e => {
            console.log('onicecandidate',e);
          }
          peerConnection.onnegotiationneeded = async (e) => {
            console.log('onnegotiationneeded',e);
          }
            //await createAndSendOffer();
            stream.getTracks().forEach(track => peerConnection.addTrack(
            track,
            stream,
          ));
          const offer = await peerConnection.createOffer();
          await peerConnection.setLocalDescription(offer);
          let data = await getJSON('/getinterlocutor',{id:''+Math.random(),offer})
          message.info('Собеседнику отправлен запрос')
          console.log('answer',data.answer);
          await peerConnection.setRemoteDescription(data.answer);
          console.log('setRemoteDescription',peerConnection);
          // };
          let dataChan=peerConnection.createDataChannel('tre')
          console.log('dataChan',dataChan);
          dataChan.onopen = ()=>{console.log('onopen')};
          dataChan.onclose = ()=>{console.log('onclose')};
          
        
          // let ws = new WebSocket('wss://localhost:8888/wssdfdss')
          // ws.onopen=()=>{
          //   ws.send(JSON.stringify({type:'callOffser',data:offer}))
          // }
          // console.log(ws);
          // console.log('setLocalDescription',offer);
          }catch(err){
            console.log(err);
            message.error(err.message)
          }
        }}>Найти собеседника</Button>
        <Button
          onClick={async ()=>{
            const peerConnection = new RTCPeerConnection({
              iceServers: [{"url":"stun:stun.l.google.com:19302"}],
            });
            peerConnection.connectionstatechange=()=>{
              console.log('connectionstatechange');
            }
            peerConnection.ontrack=(event)=>{
              let video = document.getElementById('sdgdsfgsgegrdsr')
              video.srcObject = event.streams[0];
          }
          peerConnection.onaddstream=(e)=>{
            console.log(e);
            console.log('onaddstream');
          }
          peerConnection.ondatachannel=()=>{
            console.log('ondatachannel');
          }
          peerConnection.onconnectionstatechange=(e)=>{
            console.log('onconnectionstatechange',e);
          }
           peerConnection.onicecandidate = async e => {
            if(e.candidate){
              console.log('onicecandidate',e.candidate);
              let add = await peerConnection.addIceCandidate(e.candidate)
              console.log('after add', add);
            }
            
            
          }
          let data = await getJSON('/setinterlocutor',{});
          message.info('Собеседник найден')
          await peerConnection.setRemoteDescription(data.offer);
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
          await getJSON('/answerinterlocutor',{id:data.id,answer});
          console.log(peerConnection);
         
          //const answer = await peerConnection.createAnswer();
            //await peerConnection.setRemoteDescription(offerFromAlice);
          }}
        >Стать собеседником чтоб меня нашли</Button>
        </div>
    }
  }
  async function getJSON(path, data){
  
          let res = await fetch(path,{method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify(data)})
          
          if(res.status!==200){
            throw new Error(await res.text()||'Произошла непредвиденная ошибка')
          }else{
            return await res.json()
          }
  }