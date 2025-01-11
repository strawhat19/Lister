import { log } from '@/shared/variables';
import React, { useState } from 'react';
import { Text, View } from '@/components/theme/Themed';
import { TextInput, StyleSheet, Button, InputAccessoryView, Keyboard } from 'react-native';

export default function ItemForm({ }: any) {
    const [description, setDescription] = useState('');
    const inputAccessoryViewID = 'uniqueInputAccessoryViewID';

    const handleDone = () => {
        Keyboard.dismiss();
        log('Done', 'Input submitted!');
    };

    const handleCancel = () => {
        setDescription('');
        Keyboard.dismiss();
        log('Canceled', 'Input cleared!');
    };

    const [form, setForm] = useState({
        name: '',
        image: '',
        summary: '',
        description: '',
    });

    const handleInputChange = (field: string, value: string) => {
        setForm({ ...form, [field]: value });
    };

    const handleSubmit = () => {
        if (!form.name || !form.summary || !form.image || !form.description) {
            log('Error', 'All fields are required!');
            return;
        }

        log('Form Submitted', JSON.stringify(form, null, 2));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>
                Name
            </Text>
            <TextInput
                style={styles.input}
                value={form.name}
                placeholder="Enter Name"
                onChangeText={(text) => handleInputChange('name', text)}
            />

            <Text style={styles.label}>
                Summary
            </Text>
            <TextInput
                style={styles.input}
                value={form.summary}
                placeholder="Enter Summary"
                onChangeText={(text) => handleInputChange('summary', text)}
            />

            <Text style={styles.label}>
                Image URL
            </Text>
            <TextInput
                value={form.image}
                style={styles.input}
                placeholder="Enter Image URL"
                onChangeText={(text) => handleInputChange('image', text)}
            />

            <View style={styles.container}>
                <Text style={styles.label}>
                    Description
                </Text>
                <TextInput
                    multiline={true}
                    numberOfLines={4}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Enter Description"
                    style={[styles.input, styles.textarea]}
                    inputAccessoryViewID={inputAccessoryViewID} // Link InputAccessoryView
                />

                <InputAccessoryView nativeID={inputAccessoryViewID}>
                    <View style={styles.accessory}>
                        <Button title="Cancel" onPress={handleCancel} />
                        <Button title="Done" onPress={handleDone} />
                    </View>
                </InputAccessoryView>
            </View>

            <Button title="Submit" onPress={handleSubmit} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        // backgroundColor: '#f5f5f5',
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: 'bold',
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 10,
        // borderColor: '#ccc',
        // backgroundColor: '#fff',
    },
    textarea: {
        height: 80, // Higher height for textarea
        textAlignVertical: 'top', // Align text to the top
    },
    accessory: {
        borderTopWidth: 1,
        paddingVertical: 5,
        flexDirection: 'row',
        paddingHorizontal: 10,
        borderTopColor: '#ccc',
        // backgroundColor: '#f0f0f0',
        justifyContent: 'space-between',
    },
});