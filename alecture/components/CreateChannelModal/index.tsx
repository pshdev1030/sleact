import Modal from '@components/Modal';
import useInput from '@hooks/useInput';
import { Button, Input, Label } from '@pages/SignUp/styles';
import { IChannel, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React,{useCallback, VFC} from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import useSWR from 'swr';

interface Props{
    show:boolean;
    onCloseModal:()=>void;
    setShowCreateChannelModal:(flag:boolean)=>void;
}

const CreateChannelModal:VFC<Props>=({show,onCloseModal,setShowCreateChannelModal})=>{
    const [newChannel,onChangeNewChannel,setNewChannel]=useInput('');
    const {workspace,channel}=useParams<{workspace:string;channel:string}>();
    const {data:userData,error,revalidate,mutate}=useSWR<IUser|false>('http://localhost:3095/api/users',fetcher,{
        dedupingInterval:2000,
        // 캐시의 유지기간 2초 약간 쓰로틀링 느낌
    });
    const {data:channelData,revalidate:revalidateChannel}=useSWR<IChannel[]>(
        userData?`/api/workspaces/${workspace}/channels`:null,fetcher
    )
    const [newUrl,onChangeUrl]=useInput('');
    const onCreateChannel =useCallback((e)=>{
        e.preventDefault();
        axios.post(`/api/workspaces/${workspace}/channels`,{
            name:newChannel,
        },{
            withCredentials:true,
        },
        ).then(()=>{
            setShowCreateChannelModal(false);
            revalidateChannel();
            setNewChannel('');
        }
        ).catch((error)=>{
            console.dir(error);
            toast.error(error.response?.data,
                {autoClose: 3000 ,
                position: toast.POSITION.BOTTOM_CENTER
            })
        })
    },[newChannel]);

    return(
        <Modal show={show} onCloseModal={onCloseModal}>
            <form onSubmit={onCreateChannel}>
                <Label id="channel-label">
                    <span>채널</span>
                    <Input id="workspace" value={newChannel} onChange={onChangeNewChannel}/>
                </Label>
                <Button type="submit">생성하기</Button>
            </form>
        </Modal>
    )
}

export default CreateChannelModal;