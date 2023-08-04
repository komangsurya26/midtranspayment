import {Box, Button, TextField} from '@mui/material'
import { useEffect, useState } from 'react';
import axios from 'axios'



export default function Home() {
    const clientkey = '' // isi dengan benar dengan sandbox
    const [name, setName] = useState('')
    const [order_id,setOrder_id ] = useState('')
    const [total,setTotal ] = useState(0)
    const [token, setToken] = useState('')

    async function proses () {
        const data = {
            name: name,
            order_id: order_id,
            total: total
        }
       const config = {
        headers:{
            "Content-Type " : "application/json"
        }
       }
       const response = await axios.post("http://localhost:2001/payment/process-trx", data, config)
        setToken(response.data.token)
    }


    useEffect(()=>{
        if (token) {
            window.snap.pay(token, {
                onSuccess: (result) => {
                    localStorage.setItem('pembayaran', JSON.stringify(result))
                    setToken('')
                    window.location.href = 'http://localhost:5173'
                },
                onPending: (result) => {
                    localStorage.setItem("pembayaran", JSON.stringify(result))
                    setToken('')
                    window.location.href = 'http://localhost:5173'
                },
                onError : (error) => {
                    console.log(error);
                    setToken('')
                    window.location.href = 'http://localhost:5173'
                },
                onClose: () => {
                    console.log('anda belum menyelesaikan pembayaran');
                    setToken('')
                }
            })
            setName('')
            setOrder_id('')
            setTotal('')
        }
    },[token])

    useEffect(()=> {
        const midtransUrl = 'https://app.sandbox.midtrans.com/snap/snap.js'
        let scriptTag = document.createElement('script')
        scriptTag.src = midtransUrl

        const midtransClientKey = clientkey
        scriptTag.setAttribute("data-client-key", midtransClientKey)

        document.body.appendChild(scriptTag)

        return () => {
            document.body.removeChild(scriptTag)
        }
    },[])

    return (
        <Box sx={{display:'flex', flexDirection: 'column', height: '100vh', width:'50vw', padding: 4, }}>
           <TextField value={name} type='text' label='Nama' onChange={(ev)=> setName(ev.target.value)} sx={{marginBottom: 2}}></TextField>
           <TextField value={order_id} type='text' label='Order Id' onChange={(ev)=> setOrder_id(ev.target.value)} sx={{marginBottom: 2}} ></TextField>
           <TextField value={total} type='number' label='Total' onChange={(ev)=> setTotal(ev.target.value)} sx={{marginBottom: 2}}></TextField>
           <Box>
               <Button onClick={proses} variant='outlined'>Process</Button>
           </Box>
        </Box>
    );
}