import { Snackbar, IconButton } from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
    TextInput,
    Text,
    Paper,
    Group,
    Button,
    Divider,
    Stack,
    Box,
    Notification,
    Alert,
    Modal,
    Center,
    Loader,
    Container,
  } from "@mantine/core";
import { MetamaskActions, MetaMaskContext } from "../../context/metamask";
import { initiateFilecoinSnap, isFilecoinSnapInstalled } from "../../services/metamask";
import { isMetamaskSnapsSupported, isSnapInstalled } from "@safient/wallet-adapter";
import { IconAlertCircle, IconPlugConnected } from "@tabler/icons";
//@ts-ignore
import MetaMask from "../../assets/icons/flask.svg";
import { Image } from "../../components/primitives/image/image.component";

export const MetaMaskConnector = () => {

    const [state, dispatch] = useContext(MetaMaskContext);
    const [needSnap, setNeedSnap] = useState<null | boolean>(null);
    const [installing, setInstalling] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            const isConnected = sessionStorage.getItem('metamask-snap');
            console.log(isConnected)
            
            if (isConnected) {
                if (await isFilecoinSnapInstalled()) {
                    const installResult = await initiateFilecoinSnap();
                    dispatch({
                        type: MetamaskActions.SET_INSTALLED_STATUS,
                        payload: { isIznstalled: true, snap: installResult.snap  }
                    });
                }
            }
        })();
    }, [dispatch]);
    

    useEffect(() => {
        (async () => {
            if (state.hasMetaMask) setNeedSnap(await isMetamaskSnapsSupported());
        })();
    }, [state.hasMetaMask]);

    const installSnap = useCallback(async () => {

        setInstalling(true);
        const installResult = await initiateFilecoinSnap();
        if (!installResult.isSnapInstalled) {
            setInstalling(false);
            dispatch({
                type: MetamaskActions.SET_INSTALLED_STATUS,
                payload: { isInstalled: false, message: "Please accept snap installation prompt" }
            })
        } else {
            dispatch({
                type: MetamaskActions.SET_INSTALLED_STATUS,
                payload: { isInstalled: true, snap: installResult.snap }
            });
            sessionStorage.setItem('metamask-snap', "connected");
        }
    }, [dispatch]);

    const handleClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        dispatch({ type: MetamaskActions.SET_INSTALLED_STATUS, payload: false })
    };

    const shouldDisplaySnackbar = (): boolean => {
        return !!(!state.filecoinSnap.isInstalled && state.filecoinSnap.message);
    };

    return (
        <div>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={shouldDisplaySnackbar()}
                autoHideDuration={6000}
                onClose={handleClose}
                message={state.filecoinSnap.message}
                action={
                    <React.Fragment>
                        <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </React.Fragment>
                }
            />
            {!state.hasMetaMask && <>
                <Alert variant="light" icon={<IconAlertCircle size={16} />} color="red">Ensure that MetaMask is installed!</Alert>
                <Box mt={"1rem"} />
                </>}
            {!(!state.hasMetaMask || !!needSnap) && <>
                <Alert variant="light" icon={<IconAlertCircle size={16} />} color="red"><a target='_blank' href='https://metamask.io/flask/'>Metamask flask </a> is required to run snap! Download from <a target='_blank' href='https://chrome.google.com/webstore/detail/metamask-flask-developmen/ljfoeinjpaedjfecbmggjgodbgkmjkjk'>here</a></Alert>
                <Box mt={"1rem"} />
                </>}
            <Stack align={"center"}>
            <Button
                disabled={!state.hasMetaMask || !needSnap}
                onClick={installSnap}
                variant="outline"
                color="primary"
                leftIcon={<Image src={MetaMask} width={20} />}
                
            >
                Connect to MetaMask
            </Button>
            <Alert icon={<IconPlugConnected size={32} />} title="Connect your MetaMask!" color="grape" radius="lg">
            Install the Safient Snap by connecting MetaMask and providing the required permissions.
    </Alert>
            </Stack>
            <Box mt={73}>
            {installing && (
              <Notification
                sx={{ width: "100%", boxShadow: "none" }}
                loading={true}
                disallowClose
              >
                Installing Safient Snap ...
              </Notification>
            )}
            {/* {isTransferSuccess && (
              <Notification
                icon={<IconCheck size={20} />}
                color="green"
                sx={{ width: "100%", boxShadow: "none" }}
                disallowClose
              >
                {utils.formatEther(balance)} Matic Token received
              </Notification>
            )} */}
          </Box>
        </div>
    );
};