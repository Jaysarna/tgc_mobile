import { create } from 'zustand';
import { combine } from 'zustand/middleware';
import toast from 'react-hot-toast';
import Api from '@/configs/apiUtils';



const userPath = '/resource/User';

const useUserStore = create(
    combine(
        {
            user: {
                username: null,
                list: [],
                total: 0,
                page: 1,
                size: 10,
                search: null,
            },
        },
        (set, get) => ({
            get: {
                list: async () => {
                    const {
                        user: { page, size, search },
                    } = get();

                    try {
                        const queryParams = {
                            limit_start: (page - 1) * size,
                            limit_page_length: size,
                            filters: search ? { name: ['like', `%${search}%`] } : undefined,
                            fields: JSON.stringify(['username', 'name', 'email']),
                        };

                        const res = await toast.promise(
                            Api.get(userPath, queryParams),
                            {
                                loading: '',
                                success: '',
                                error: 'Error fetching users',
                            }
                        );

                        set((prev) => ({
                            user: {
                                ...prev.user,
                                list: res.data.map(user => ({
                                    id: user.id,
                                    name: user.name,
                                    email: user.email,
                                    username: user.username,

                                })) || [],
                                total: res.total || 0,
                            },
                        }));
                    } catch (error) {
                        console.error("Failed to fetch users:", error);
                    }
                },

                paginate: ({ page, size, search }) => {
                    set((prev) => ({
                        user: {
                            ...prev.user,
                            page: page ?? prev.user.page,
                            size: size ?? prev.user.size,
                            search: search ?? prev.user.search,
                        },
                    }));
                    get().get.list();
                },
            },

            select: (username) => set((prev) => ({ user: { ...prev.user, username } })),

            add: async (userData) => {
                const { id } = get().user;

                const res = await toast.promise(
                    id
                        ? Api.put(`${userPath}/${id}`, userData)
                        : Api.post(userPath, userData),
                    {
                        loading: id ? 'Updating user...' : 'Adding user...',
                        success: id ? 'User updated successfully' : 'User added successfully',
                        error: 'Failed to add or update user',
                    }
                );

                if (res) get().get.paginate({});
            },


            update: async (userData) => {
                const { username } = get().user;

                if (!id) return toast.error('No user selected to update');

                try {
                    await userService.updateUser(id, userData);
                    get().get.paginate({});
                } catch (error) {
                    console.error("Update user error:", error);
                }
            },


            delete: async () => {
                const { id } = get().user;

                if (!id) return toast.error('No user selected to delete');

                await toast.promise(Api.del(`${userPath}/${id}`), {
                    loading: 'Deleting user...',
                    success: 'User deleted successfully',
                    error: 'Failed to delete user',
                });

                get().get.paginate({});
            },
        })
    )
);

export default useUserStore;