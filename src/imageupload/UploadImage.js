
import FormData from 'form-data';
import { Platform } from 'react-native';
import axios from 'axios'
import { BASEURL, token, path, owner_record_id } from '../Config'

export const getImageData = (photo, body) => {
    const sourceAsString = photo.path.toString();
    const fileName = sourceAsString.split('/').pop();
    const data = new FormData();
    data.append('myFile', {
        type: photo.mime,
        name: fileName,
        uri: Platform.OS === 'android' ? photo.path : photo.path.replace('file://', ''),

    });

    if (body != undefined)
        Object.keys(body).forEach(key => {
            data.append(key, body[key]);
        });

    return data;
};

export const uploadImage = (imageArray) => {
    console.log(imageArray.length);
    let data = { owner_record_id: owner_record_id, owner_record_type: 'applications' }
    authenticatedRequest(token, BASEURL + path, data, 'post').then(response => {
        console.log(`response ` + response)
        if (response.status === 200) {
            let imgData = getImageData(imageArray[0]);
            let header = {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'multipart/form-data',
                'X-Android-Version': `4.0.0`,
            }
            request(BASEURL + "android/files/" + response.data.id + "/content", imgData, 'post', header).then(response => {
                console.log(`response ` + response)
            }).catch(error => {
                let err = error;
                console.log('error ' + err)
            })
        }
    }).catch(error => {
        let err = error;
        console.log('error ' + err)
    })

}



export const authenticatedRequest = (
    token,
    path, data, method, header = {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
        'X-Android-Version': `4.0.0`,
    }
) => request(
    path, data, method,
    header,
);


export const request = (
    path, data, method, headers = {},
) => {
    if (__DEV__) {
        console.log(path, method, data);
    }

    return axios({
        url: `${path}`,
        data,
        method,
        headers,
    });
};
