import {observer} from "mobx-react";
import {useHistory} from "react-router-dom";
import {useAccountStore} from "../../store/AccountStore";

const AuthVerifier = observer(() => {
    const history = useHistory();
    const {checkAuth} = useAccountStore();

    history.listen(() => {
        checkAuth();
    });

    return <div/>;
});

export default AuthVerifier;