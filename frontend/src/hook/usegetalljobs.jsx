import { setAllJobs } from '@/redux/jobslice'
import { JOB_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const usegetallJobs = () => {
    const dispatch = useDispatch();
    const { searchedQuery } = useSelector(store => store.job);
    useEffect(() => {
        const fetchAllJobs = async () => {
            try {
                const token = localStorage.getItem("token"); // save token after login
                const res = await axios.get(`${JOB_API_END_POINT}/get?keywords=`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                });
                console.log(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchAllJobs();
    }, [searchedQuery])
}

export default usegetallJobs