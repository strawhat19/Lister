import { web } from '@/shared/variables';
import Registration from '@/components/registration/registration';

export default function Index({ }) {
    return (
        web() ? `Home Page` : <Registration />
    )
}