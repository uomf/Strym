import { Routes, Route } from 'react-router-dom';
import Sidebar from '../sections/Sidebar';
import Content from '../sections/Content';
import Bookmark from '../sections/Bookmark';
import Setting from '../sections/Setting';
import Upload from '../sections/Upload';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Main() {
    const [isBusinessUser, setIsBusinessUser] = useState(false);

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_STRYM_API_URL}/user/role`, {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                });
                console.log("isEditor: ", response.data.editor);
                setIsBusinessUser(response.data.editor);
            } catch (error) {
                console.error('Error fetching user role:', error);
            }
        }
        fetchUserRole();
    })

    return (
        <div className="flex h-screen">
            <Sidebar role={isBusinessUser} />
            <div className="flex-1 overflow-auto">
                <Routes>
                    <Route path="feed" element={<Content isSlotMachine={false} />} />
                    <Route path="slot" element={<Content isSlotMachine={true} />} />
                    <Route path="bookmark" element={<Bookmark />} />
                    <Route path="setting" element={<Setting />} />
                    <Route path="upload" element={<Upload />} />
                    <Route path="*" element={<Content isSlotMachine={false} />} />
                </Routes>
            </div>
        </div>
    );
}