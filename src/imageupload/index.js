import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Photos } from './Photos'
import { uploadImage } from './UploadImage'

const ImageUpload = props => {
    const { img } = props;
    const [images, setImages] = useState([])
    return (
        <View style={styles.conatainer}>
            <Photos
                onPhotoAdded={(photos) => {
                    if (photos.length > 0) {
                        setImages(photos)
                    } else {
                        setImages([])

                    }
                }} />
            {
                images.length > 0 ? <TouchableOpacity onPress={() => uploadImage(images)}>
                    <Text style={{ paddingVertical: 10, paddingHorizontal: 40, backgroundColor: 'blue', color: 'white', alignSelf: "center", marginTop: 60 }}>
                        Upload
                    </Text>
                </TouchableOpacity> : null
            }

        </View>
    );
};

export default ImageUpload;

const styles = StyleSheet.create({
    conatainer: {
        flex: 1,
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 2,
    },
});
