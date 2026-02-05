import { logoutUserAction } from '@/features/auth/server/auth.actions'
import { getCurrentUser } from '@/features/auth/server/auth.queries';
import { redirect } from 'next/navigation';

const ApplicantDashboard = async () => {
    const user = await getCurrentUser();

    if (!user) return redirect("/login");

    return (
        <>
            <div>ApplicantDashboard</div>
            <button onClick={logoutUserAction}>Logout</button>
        </>
    )
}

export default ApplicantDashboard