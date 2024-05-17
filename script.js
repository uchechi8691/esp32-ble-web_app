let bleDevice;
let bleServer;
let settingsCharacteristic;
let blockSizeCharacteristic;
let blockNumberCharacteristic;
let setTimeCharacteristic;
let saveSettingsCharacteristic;

document.getElementById('connectButton').addEventListener('click', async () => {
    try {
        bleDevice = await navigator.bluetooth.requestDevice({
            filters: [{ services: ['7b128e84-58e4-4feb-8861-f608ad7bb597'] }]
        });
        bleServer = await bleDevice.gatt.connect();
        const service = await bleServer.getPrimaryService('7b128e84-58e4-4feb-8861-f608ad7bb597');

        settingsCharacteristic = await service.getCharacteristic('fd39a7da-6353-4e32-bf7b-346af6e8a9ce');
        blockSizeCharacteristic = await service.getCharacteristic('9ad3a4cd-4e1d-43ae-89b9-c5dc8f7ccfa8');
        blockNumberCharacteristic = await service.getCharacteristic('3426fd0b-16c0-47ea-b1df-8a0485d9634f');
        setTimeCharacteristic = await service.getCharacteristic('0bfc0c37-c489-4e4e-a980-00d182282278');
        saveSettingsCharacteristic = await service.getCharacteristic('42db0c09-f123-40ab-8bf5-68ad70c9a0db');

        document.getElementById('settings').classList.remove('hidden');
        document.getElementById('saveSettingsButton').classList.remove('hidden');
        alert('Connected to BLE device!');

        // Read and display current settings
        await readAndDisplaySettings();

    } catch (error) {
        console.error('Failed to connect', error);
        alert('Failed to connect to BLE device. ' + error);
    }
});

async function readAndDisplaySettings() {
    try {
        const deviceNameValue = await settingsCharacteristic.readValue();
        const deviceName = new TextDecoder().decode(deviceNameValue);
        document.getElementById('deviceName').value = deviceName;

        const blockSizeValue = await blockSizeCharacteristic.readValue();
        const blockSize = new TextDecoder().decode(blockSizeValue);
        document.getElementById('blockSize').value = blockSize;

        const blockNumberValue = await blockNumberCharacteristic.readValue();
        const blockNumber = new TextDecoder().decode(blockNumberValue);
        document.getElementById('blockNumber').value = blockNumber;

        const timeValue = await setTimeCharacteristic.readValue();
        const time = new TextDecoder().decode(timeValue);
        document.getElementById('time').value = time;
    } catch (error) {
        console.error('Failed to read settings', error);
        alert('Failed to read settings. ' + error);
    }
}

document.getElementById('saveSettingsButton').addEventListener('click', async () => {
    try {
        const deviceName = document.getElementById('deviceName').value;
        const blockSize = document.getElementById('blockSize').value;
        const blockNumber = document.getElementById('blockNumber').value;
        const time = document.getElementById('time').value;

        if (deviceName) {
            await settingsCharacteristic.writeValue(new TextEncoder().encode(deviceName));
        }

        if (blockSize) {
            await blockSizeCharacteristic.writeValue(new TextEncoder().encode(blockSize));
        }

        if (blockNumber) {
            await blockNumberCharacteristic.writeValue(new TextEncoder().encode(blockNumber));
        }

        if (time) {
            await setTimeCharacteristic.writeValue(new TextEncoder().encode(time));
        }

        await saveSettingsCharacteristic.writeValue(new TextEncoder().encode('save'));

        alert('Settings saved!');
    } catch (error) {
        console.error('Failed to save settings', error);
        alert('Failed to save settings. ' + error);
    }
});
