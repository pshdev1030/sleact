import React, { useCallback } from 'react';
import { Container, Header } from '@pages/Channel/styles';
import useInput from '@hooks/useInput';
import ChatList from '@components/ChatList';
import ChatBox from '@components/ChatBox';

const Channel=()=>{
    const [chat,onChangeChat,setChat]=useInput('');
    const onSubmitForm=useCallback((e)=>{
        e.preventDefault();
        console.log(e);
    },[]);
    return(
            <Container>
                <Header>채널!</Header>
                <ChatList/>
                <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} setChat={setChat}/>
            </Container>
    );
}

export default Channel;