function calculateSubnet() {
    const hostIpAddress = document.getElementById("hostIpAddress").value.trim();
    const originalSubnetMask = document.getElementById("originalSubnetMask").value.trim();
    const newSubnetMask = document.getElementById("newSubnetMask").value.trim();

    console.log("Host IP Address:", hostIpAddress);
    console.log("Original Subnet Mask:", originalSubnetMask);
    console.log("New Subnet Mask:", newSubnetMask);

    try {
        validateInput(hostIpAddress, "Host IP Address");
        validateInput(originalSubnetMask, "Original Subnet Mask");
        validateInput(newSubnetMask, "New Subnet Mask");

        console.log("Before calculateSubnetInfo");
        const subnetBits = calculateSubnetBits(originalSubnetMask, newSubnetMask);
        console.log("Number of Subnet Bits:", subnetBits);

        const result = performSubnetCalculation(hostIpAddress, originalSubnetMask, newSubnetMask, subnetBits);
        document.getElementById("result").innerText = result;
    } catch (error) {
        console.error("Error:", error.message);
        document.getElementById("result").innerText = "Invalid input. " + error.message;
    }
}

function validateInput(value, fieldName) {
    if (!value) {
        throw new Error(`${fieldName} is required.`);
    }

    // Check if the value is a valid IP address or subnet mask
    const octets = value.split('.');
    if (octets.length !== 4) {
        throw new Error(`${fieldName} must have 4 octets.`);
    }

    for (let i = 0; i < 4; i++) {
        if (isNaN(octets[i]) || octets[i] < 0 || octets[i] > 255) {
            throw new Error(`Each octet in ${fieldName} must be a number between 0 and 255.`);
        }
    }
}

function calculatePrefix(subnetMask) {
    return subnetMask.split('.').map(Number).reduce((acc, octet) => {
        const binaryOctet = octet.toString(2).padStart(8, '0');
        return acc + binaryOctet.split('1').length - 1;
    }, 0);
}

function calculateSubnetBits(originalSubnetMask, newSubnetMask) {
    const originalPrefix = calculatePrefix(originalSubnetMask);
    const newPrefix = calculatePrefix(newSubnetMask);
    return newPrefix - originalPrefix;
}

function calculateNumSubnets(subnetBits) {
    return Math.pow(2, subnetBits);
}

function calculateHostBits(newSubnetMask) {
    const subnetBits = calculatePrefix(newSubnetMask);
    return 32 - subnetBits;
}

function calculateNumHosts(hostBits) {
    return Math.pow(2, hostBits) - 2;
}

function performSubnetCalculation(hostIpAddress, originalSubnetMask, newSubnetMask, subnetBits) {
    console.log("Inside performSubnetCalculation");
    console.log("Host IP Address:", hostIpAddress);
    console.log("Original Subnet Mask:", originalSubnetMask);
    console.log("New Subnet Mask:", newSubnetMask);

    const numSubnets = calculateNumSubnets(subnetBits);
    const hostBits = calculateHostBits(newSubnetMask);

    console.log("Number of Subnet Bits:", subnetBits);
    console.log("Number of Host Bits per Subnet:", hostBits);

    const networkAddress = calculateNetworkAddress(hostIpAddress, newSubnetMask);
    const firstHost = calculateFirstHost(networkAddress);
    const broadcastAddress = calculateBroadcastAddress(networkAddress, newSubnetMask);
    const lastHost = calculateLastHost(broadcastAddress);

    return `Number of Subnet Bits: ${subnetBits}\nNumber of Subnets Created: ${numSubnets}\nNumber of Host Bits per Subnet: ${hostBits}\nNumber of Hosts per Subnet: ${calculateNumHosts(hostBits)}\nNetwork Address of this Subnet: ${networkAddress}\nIPv4 Address of First Host on this Subnet: ${firstHost}\nIPv4 Address of Last Host on this Subnet: ${lastHost}\nIPv4 Broadcast Address on this Subnet: ${broadcastAddress}`;
}

function calculateNetworkAddress(ipAddress, newSubnetMask) {
    const ipArr = ipAddress.split('.').map(Number);
    const maskArr = newSubnetMask.split('.').map(Number);

    if (ipArr.length !== 4 || maskArr.length !== 4) {
        throw new Error("Invalid IP Address or Subnet Mask format.");
    }

    const networkArr = ipArr.map((octet, index) => octet & maskArr[index]);
    return networkArr.join('.');
}

function calculateFirstHost(networkAddress) {
    const firstHostArr = networkAddress.split('.').map((octet, index) => (index === 3) ? parseInt(octet) + 1 : octet);
    return firstHostArr.join('.');
}

function calculateBroadcastAddress(networkAddress, newSubnetMask) {
    const maskArr = newSubnetMask.split('.').map(Number);
    const invertedMaskArr = maskArr.map(octet => 255 - octet);

    const networkArr = networkAddress.split('.').map(Number);

    const broadcastArr = networkArr.map((octet, index) => octet | invertedMaskArr[index]);

    return broadcastArr.join('.');
}

function calculateLastHost(broadcastAddress) {
    const lastHostArr = broadcastAddress.split('.').map((octet, index) => (index === 3) ? parseInt(octet) - 1 : octet);
    return lastHostArr.join('.');
}

document.getElementById('subnetForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from being submitted normally
    calculateSubnet();
});