import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ImageBackground, TouchableOpacity, FlatList, Modal, Platform } from 'react-native';
import addImage from './pngs/addImage.png'
import ImagePicker from 'react-native-image-crop-picker';
import FastImage from 'react-native-fast-image';




const showImagePicker = (selectedPhotos, setSelectedPhotos) => {
    ImagePicker.openPicker({
        multiple: true
    }).then(images => {
        console.log(images);
        try {
            let photoArray = Object.assign([], selectedPhotos);
            images.map(image => photoArray.push(image));
            setSelectedPhotos(photoArray);
        } catch (error) {
            console.log(`error ${error}`)
        }
    });
}

const renderImage = (imageData, index, selectedPhotos, setSelectedPhotos) => {
    return (<View style={styles.imageContainer} >
        <ImageBackground style={[styles.addImage, { flexDirection: 'row', justifyContent: "flex-end" }]} imageStyle={{ resizeMode: 'stretch' }}
            source={imageData != undefined ? { uri: imageData.path } : addImage} >
            <TouchableOpacity style={styles.crossBg}
                onPress={() => {
                    if (selectedPhotos != undefined && setSelectedPhotos != undefined) {
                        let photoArray = Object.assign([], selectedPhotos);
                        photoArray.splice(index, 1);
                        setSelectedPhotos(photoArray);
                    }
                }}
            >
                <Text style={styles.crossTextBg}>X</Text>
            </TouchableOpacity>
        </ImageBackground >
    </View >)
}

export const Photos = props => {
    const { title = `Photos`, onPhotoAdded } = props;
    const [selectedPhotos, setSelectedPhotos] = useState([]);
    useEffect(() => {
        if (onPhotoAdded != undefined)
            onPhotoAdded(selectedPhotos)
    }, [selectedPhotos]);
    return (
        <View style={styles.conatainer}>
            {title ? <Text bold={true}>{title}</Text> : null}
            <FlatList
                data={selectedPhotos}
                keyExtractor={(item => item.path)}
                renderItem={({ item, index }) => { return renderImage(item, index, selectedPhotos, setSelectedPhotos) }}
                horizontal={true}
                ListFooterComponent={() => <TouchableOpacity style={{ alignSelf: 'center', marginTop: 15 }}
                    onPress={() => showImagePicker(selectedPhotos, setSelectedPhotos)}>
                    <View>
                        <ImageBackground style={styles.addImage} imageStyle={{ resizeMode: 'contain' }} source={addImage} >
                            <Text style={styles.plusText}>{`+`}</Text>
                        </ImageBackground>
                    </View>
                </TouchableOpacity>}
            />
        </View>
    );
};

export const PhotoThumb = (props) => {
    const [fullView, setFullView] = useState(false);
    const [image, setImage] = useState()
    return (<View>
        <Modal visible={fullView} onRequestClose={() => setFullView(false)}>
            {fullView ?
                <View style={{ width: '100%', height: '100%' }}>

                    <FastImage
                        style={{ width: '100%', flex: 1 }}
                        source={{ uri: image, backgroundColor: '#000' }}
                        resizeMode='contain'
                    />
                </View> : <View></View>
            }
        </Modal>
        <FlatList
            data={props.imagearray}
            keyExtractor={item => item.id.toString()}
            horizontal={true}
            renderItem={({ item }) => {
                console.log('item', item);
                return (
                    <TouchableOpacity onPress={() => {
                        setFullView(true)
                        setImage(item.thumbnail_url)
                    }}>
                        <FastImage
                            source={{ uri: item.thumbnail_url, backgroundColor: '#f7f7f7' }}
                            style={{
                                borderRadius: 4,
                                borderWidth: StyleSheet.hairlineWidth,
                                borderStyle: 'solid',
                                margin: props.margin ? props.margin : 2,
                                width: props.imagewidth ? props.imagewidth : 60,
                                height: props.imageheight ? props.imageheight : 60
                            }}
                        />
                    </TouchableOpacity>
                )
            }}
        />
    </View>
    )
};

const styles = StyleSheet.create({
    conatainer: {
        paddingVertical: 10,
        paddingHorizontal: 2,
    },
    imageContainer: { flexDirection: 'row', marginTop: 15, },
    addImage: { height: 95, width: 95, resizeMode: 'cover', borderRadius: 10, justifyContent: 'center', marginRight: 10, borderColor: 'gray', borderWidth: .5 },
    plusText: {
        color: 'gray', fontSize: 34, alignSelf: 'center', fontFamily: 'OpenSans-Regular',
    },
    crossBg: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)', height: 25, width: 25, borderRadius: 12.5, margin: 4, borderColor: 'white', borderWidth: 1, alignItems: 'center'
    },
    crossTextBg: { alignSelf: 'center', color: 'white', fontSize: 10, paddingTop: 4 }
});
