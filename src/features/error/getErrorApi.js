import toast from "react-hot-toast";



export async function handleShowApiError(err) {
    console.log(err)
    if (err?.response?.status != 401) {
        showApiError(err?.response?.data)
    }
    else {
        toast.error('UNAUTHORIZED Please Login Again')
        window.location.replace('/')
        sessionStorage.clear()
    }



}


async function showApiError(err) {

    console.log(err)
    try {
        const serverMessages = JSON.parse(err?._server_messages);

        const firstMessage = serverMessages[0];

        // console.log(firstMessage)
        const messageObject = JSON.parse(firstMessage);

        const htmlRegex = /<[^>]*>/g;

        const plainText = messageObject?.message.replace(htmlRegex, "");
        // console.log(plainText)

        // console.log(messageObject?.message)


        toast.error(plainText);
    }
    catch (err) {
        console.log('fired')
        console.log(err)
        // toast.error('Please Try Again')
    }

}