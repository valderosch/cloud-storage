import axios from "axios";
import {addFile, setFiles} from "../reducers/fileReducer";

const host = 'http://localhost';
const port = '5000';

export function getFiles(dirId){
    return async dispatch => {
        try{
            const responce = await axios.get(`${host}:${port}/api/files${dirId ? '?parent='+dirId : ''}`, {
                headers: {Authorization: `Bearer ${localStorage.getItem('token')}`,}
            });
            dispatch(setFiles(responce.data));
            console.log(responce.data);
        } catch (e) {
            alert(e.response.data.message);
            console.log(e.response.data.message);
        }
    }
}

export function createNewDirectory(dirId, dirName){
    return async dispatch => {
        try{
            const responce = await axios.post(`${host}:${port}/api/files`,{
                filename: dirName,
                parent: dirId,
                filetype: 'dir'
            }, {
                headers: {Authorization: `Bearer ${localStorage.getItem('token')}`,}
            });
            dispatch(addFile(responce.data));
            console.log(responce.data);
        } catch (e) {
            alert(e.response.data.message);
            console.log(e.response.data.message);
        }
    }
}

export function uploadFile(file, dirId){
    return async dispatch => {
        try{
            const formData = new FormData();
            formData.append('file', file);

            if(dirId){
                formData.append('parent', dirId)
            }

            const responce = await axios.post(`${host}:${port}/api/files/upload`, formData,  {
                headers: {Authorization: `Bearer ${localStorage.getItem('token')}`,},
                onUploadProgress: progressEvent => {
                    const totalLength = progressEvent.event.lengthComputable ? progressEvent.total : progressEvent.event.target.getResponseHeader('content-length') || progressEvent.event.target.getResponseHeader('x-decompressed-content-length');
                    console.log('total', totalLength)
                    if (totalLength) {
                        let progress = Math.round((progressEvent.loaded * 100) / totalLength)
                        console.log(progress)
                    }
                }
            });
            dispatch(addFile(responce.data));
            console.log(responce.data);
        } catch (e) {
            alert(e.response.data.message);
            console.log(e.response.data.message);
        }
    }
}