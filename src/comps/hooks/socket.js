import React, { useEffect, useRef, useState } from 'react';
import socket from 'socket.io-client';
import config from '../../config';
import Auth from '../../lib/auth';

export const useSocket = props => {
    const [connected, updateConnected] = useState(false);

    useEffect(() => {
        const client = socket.connect(config.SOCKET_DOMAIN);
        client.on('connect', () => {
            updateConnected(true);

            //connected auth
            client.emit('auth', {
                authorization: 'Bearer ' + Auth.getToken()
            });

            //join room
            if (
                props.rooms &&
                Array.isArray(props.rooms) &&
                props.rooms.length > 0
            ) {
                client.emit('join_room', { rooms: props.rooms });
            }

            if (
                props.listeners &&
                Array.isArray(props.listeners) &&
                props.listeners.length > 0
            ) {
                props.listeners.map(one => {
                    const event = one.event || '';
                    const callback = one.callback || null;
                    console.log('one', one);
                    if (event && callback && typeof callback == 'function') {
                        client.on([one.event], data => {
                            callback(data);
                        });
                    }
                });
            }
        });

        client.on('disconnect', () => updateConnected(false));
    }, []);

    return { connected };
};


export const withSocket =  (Comp) => {
    
    const SocketHoc = (props) => {

        const [connected, updateConnected] = useState(false);
        const sock = useRef(null);

        useEffect(() => {
            const client = socket.connect(config.SOCKET_DOMAIN);

            client.on('connect', () => {
                updateConnected(true);

                sock.current = client;

                //connected auth
                client.emit('auth', {
                    authorization: 'Bearer ' + Auth.getToken()
                });
            });

            client.on('disconnect', () => {
                updateConnected(false);
                sock.current = null;
            });
        }, []);
        
        const emit = (event, payload) => {
            if (sock.current) {
                sock.current.emit(event, payload)
            }
        }

        const joinRoom = (room) => {
            console.log('joinRoom', room)
            if (sock.current) {
                sock.current.emit('join_room', {rooms: [room]})
            }
        }

        const leaveRoom = (room) => {
            if (sock.current) {
                sock.current.emit('leave_room', {rooms: [room]})
            }
        }

        const subscribe = (event, callback) => {
            if (sock.current) {
                sock.current.on([event], data => {
                    callback(data);
                });
            }
        }

        return (
            <Comp {...props} _connected={connected} _emit={emit} _join={joinRoom} _leave={leaveRoom} _subscribe={subscribe}/>
        )        
    }

    return SocketHoc
}