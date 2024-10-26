import { get } from '@/configs/apiUtils';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Drawer, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import NotificationIcon from '@mui/icons-material/NotificationsActive';


const Notification = () => {
    const [isOpenNotify, setOpenNotify] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unseenCount, setUnseenCount] = useState(0);

    const toggleNotificationDrawer = () => setOpenNotify(prev => !prev);

    const countUnseenMessages = (data) => {
        return data.reduce((count, message) => count + (message._seen === null ? 1 : 0), 0);
    };

    const setupPushNotifications = async () => {
        if (!('Notification' in window) || !('serviceWorker' in navigator)) {
            console.warn("Notifications API or Service Workers are not supported by this browser.");
            return;
        }

        if (Notification.permission === 'default') {
            try {
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    const registration = await navigator.serviceWorker.register('/sw.js');
                    const subscription = await registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
                    });
                    await saveSubscription(subscription);
                }
            } catch (error) {
                console.error("Failed to request notification permission:", error);
            }
        } else if (Notification.permission === 'granted') {
            // Notifications are already granted, register service worker
            const registration = await navigator.serviceWorker.register('/sw.js');
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
            });
            await saveSubscription(subscription);
        } else {
            console.warn("Notification permissions were denied.");
        }
    };

    const saveSubscription = async (subscription) => {
        try {
            await fetch('/api/save-subscription', {
                method: 'POST',
                body: JSON.stringify(subscription),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            console.error("Failed to save subscription:", error);
        }
    };






    const fetchNotifications = async () => {
        try {
            const res = await get('/resource/Notification%20Log?order_by=creation%20desc&limit=10&fields=["name","subject","email_content","_seen"]');
            const data = res?.data || [];
            setNotifications(data);
            setUnseenCount(countUnseenMessages(data));
        } catch (err) {
            console.error("Failed to fetch notifications:", err);
        }
    };

    useEffect(() => {
        fetchNotifications();
        setupPushNotifications();

    }, []);

    return (
        <div className="notification-outer">
            <div className="bell-outer" onClick={toggleNotificationDrawer}>
                <button className="btn btn-primary bell-icon">
                    <span className='notify-count'>{unseenCount}</span>
                    <NotificationIcon />
                </button>
            </div>

            <Drawer
                anchor='right'
                open={isOpenNotify}
                onClose={toggleNotificationDrawer}
                className='notification-drawer'
            >
                <h3 className='text-center mt-2'>Notifications</h3>
                <hr />
                {notifications.length > 0 ? (
                    notifications.map((notification, index) => (
                        <NotificationListItem
                            key={index + 1}
                            notification={notification}
                            refreshNotifications={fetchNotifications}
                        />
                    ))
                ) : (
                    <Typography variant="body2" className='text-center mt-2'>No notifications available</Typography>
                )}
            </Drawer>
        </div>
    );
};

const NotificationListItem = ({ notification, refreshNotifications, key }) => {
    const [isDialogOpen, setDialogOpen] = useState(false);

    const markAsRead = async () => {
        try {
            const res = await get(`/method/tgc_custom.server_script.has_seen.update_seen?notification_id=${notification.name}`);
            toast.success(res?.message);
            refreshNotifications();
        } catch (err) {
            console.error("Failed to mark notification as read:", err);
        }
    };

    const openDialog = () => {
        setDialogOpen(true);
        if (!notification._seen) {
            markAsRead();
        }
    };

    function handleClose() {
        setDialogOpen(false)
        // console.log(isDialogOpen)
    }



    return (
        <div className={`notifications ${notification._seen ? 'nt-seen' : ''}`} key={key}>
            <div className='notify-dot' />
            <div className='text-container' onClick={openDialog}>
                <h2 className='limit-1'>{notification.subject}</h2>
                <p className='limit-2'>{notification.email_content}</p>
            </div>

            <Dialog onClose={() => handleClose()} open={isDialogOpen} sx={{ p: 4 }}>
                <DialogTitle sx={{ color: '#7f56d9', fontSize: '18px' }}>{notification.subject}</DialogTitle>
                <DialogContent>
                    <Typography gutterBottom sx={{ color: "#666", fontSize: '14px' }}>
                        {notification.email_content}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleClose()}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Notification;
