import { Store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';

const useNotifications = () => {
    const showNotification = ({ title, message, type }) => {
        Store.addNotification({
            title,
            message,
            type,
            insert: 'top',
            container: 'top-right',
            animationIn: ['animate__animated', 'animate__fadeIn'],
            animationOut: ['animate__animated', 'animate__fadeOut'],
            dismiss: {
                duration: 3000,
                onScreen: true,
            },
        });
    };

    const showSuccessNotification = ({ title, message }) => {
        showNotification({
            title: title || 'Success',
            message: message || 'Operation successful',
            type: 'success',
        });
    };

    const showErrorNotification = ({ title, message }) => {
        showNotification({
            title: title || 'Error',
            message: message || 'An error occurred',
            type: 'danger',
        });
    };

    return {
        showNotification,
        showSuccessNotification,
        showErrorNotification,
    };
};

export default useNotifications;
