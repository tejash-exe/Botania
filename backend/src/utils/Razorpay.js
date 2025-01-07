import Razorpay from 'razorpay';
import 'dotenv/config';

const key_id = process.env.RAZORPAY_TEST_ID;
const key_secret = process.env.RAZORPAY_TEST_KEY;

const instance = new Razorpay({
    key_id: key_id,
    key_secret: key_secret,
});

const razorpayCreateLinkedAccount = async (seller, email) => {
    try {
        const authHeader = `Basic ${btoa(`${key_id}:${key_secret}`)}`;

        const data = JSON.stringify({
            email: email,
            phone: seller.address.contact,
            type: "route",
            legal_business_name: seller.brandName,
            business_type: "individual",
            contact_name: seller.name,
            profile: {
                category: "ecommerce",
                subcategory: "second_hand_stores",
                addresses: {
                    registered: {
                        street1: seller.address.localAddress.replace(/\./g, ""),
                        street2: seller.address.landmark.replace(/\./g, "") || seller.address.city.replace(/\./g, ""),
                        city: seller.address.city.replace(/\./g, ""),
                        state: seller.address.state.replace(/\./g, ""),
                        postal_code: seller.address.pincode.replace(/\./g, ""),
                        country: "IN"
                    }
                }
            }
        });

        // Fetch configuration
        const response = await fetch('https://api.razorpay.com/v2/accounts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: authHeader
            },
            body: data
        });

        // Handling response
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error.description);
        }
        const result = await response.json();
        console.log("Linked Account Created:", result);
        return result;
    } catch (error) {
        console.log("Error creating linked account:", error);
        throw new Error(error.message);
    }
};

const razorpayRemoveLinkedAccount = async (linkedAccountId) => {
    try {
        const key_id = process.env.RAZORPAY_TEST_ID;
        const key_secret = process.env.RAZORPAY_TEST_KEY;
        const authHeader = `Basic ${btoa(`${key_id}:${key_secret}`)}`;

        const response = await fetch(`https://api.razorpay.com/v2/accounts/${linkedAccountId}`, {
            method: 'DELETE',
            headers: {
                Authorization: authHeader,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData);
        }

        console.log(`Linked account ${linkedAccountId} removed successfully`);
        return true;
    } catch (error) {
        console.error("Error removing linked account:", error.message);
        return false;
    }
};

const razorpayCreateStakeholder = async (seller) => {
    try {
        const response = await instance.stakeholders.create(seller.razorpay.accountId, {
            "name": seller.name,
            "email": seller.razorpay.email,
            "addresses": {
                "residential": {
                    "street": seller.address.localAddress.replace(/\./g, ""),
                    "city": seller.address.city.replace(/\./g, ""),
                    "state": seller.address.state.replace(/\./g, ""),
                    "postal_code": seller.address.pincode.replace(/\./g, ""),
                    "country": "IN"
                }
            },
            "notes": {
                "sellerId": seller._id.toString(),
            }
        });

        console.log("Stakeholder Created:", response);
        return response;
    } catch (error) {
        console.log(error.error.description);
        throw new Error(error.error.description);
    }
};

const razorpayRequestRouteconfig = async (seller) => {
    const response = await instance.products.requestProductConfiguration(seller.razorpay.accountId, {
        "product_name": "route",
        "tnc_accepted": true,
    });

    console.log(response);
    return response;
};

const razorpayUpdateRouteconfig = async (seller, acc_No, ifsc_code, beneficiary_name) => {
    try {
        const response = await instance.products.edit(seller.razorpay.accountId, seller.razorpay.routeconfigId, {
            "settlements": {
                "account_number": acc_No,
                "ifsc_code": ifsc_code,
                "beneficiary_name": beneficiary_name,
            },
            "tnc_accepted": true
        });
        console.log(response);
        return response;
    } catch (error) {
        console.error(error.error.description);
        throw new Error(error.error.description);
    }
};

const razorpayFetchRouteconfig = async (seller) => {
    try {
        const response = await instance.products.fetch(seller.razorpay.accountId, seller.razorpay.routeconfigId);

        console.log(response);
        return response;
    } catch (error) {
        console.error(error.error.description);
        throw new Error(error.error.description);
    }
};

export {
    razorpayCreateLinkedAccount,
    razorpayRemoveLinkedAccount,
    razorpayCreateStakeholder,
    razorpayRequestRouteconfig,
    razorpayUpdateRouteconfig,
    razorpayFetchRouteconfig,
};