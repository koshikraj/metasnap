import { useContext, useEffect, useState } from "react";
import { useClipboard } from "@mantine/hooks";
import { IconCopy, IconCheck, IconAlertCircle, IconPlugConnected } from "@tabler/icons";
import QRCode from "react-qr-code";
import {
  Container,
  Group,
  Stack,
  Button,
  Box,
  Notification,
  Paper,
  TextInput,
  Modal,
  Loader,
  Text as ProgressText,
  Alert,
} from "@mantine/core";
import { utils } from "ethers";
import { BackButton, ProgressStatus, Title } from "../../../components";
import { useStyles } from "./create-recovery.component.styles";
import { showNotification } from "@mantine/notifications";
import useRecoveryStore from "store/recovery/recovery.store";

import { Wallet, AddressUtil } from "utils";
import { useNavigate } from "react-router-dom";
import { MetaMaskContext } from "context/metamask";
import { SafientSnapApi } from "../../../../../snap/packages/types";
import { MetaMaskConnector } from "components/MetaMaskConnector/MetaMaskConnector";

export interface AccountProps {
    address: string,
    api: SafientSnapApi | null
}

export const ConnectSnap = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();

  const [state] = useContext(MetaMaskContext);
  const [api, setApi] = useState<SafientSnapApi | null>(null);

  

  const [progressMessage, setProgressMessage] = useState("");

  const [address, setAddress] = useState('');
  const [isTransferSuccess, setIstransferSuccess] = useState(false);
  const [creating, setCreating] = useState(false);
  const {
    accountDetails,
    setAccountDetails,
    formData,
    setCreateStep,
  } = useRecoveryStore((state: any) => state);
  const wallet = new Wallet();


  useEffect(() => {

    (async () => {
      
        if (state.filecoinSnap.isInstalled && state.filecoinSnap.snap) {
            const filecoinApi = await state.filecoinSnap.snap.getFilecoinSnapApi();
            setApi(filecoinApi);
            setAddress(await filecoinApi.getAddress());
        }
    })();
}, [state.filecoinSnap.isInstalled]);




  const clipboard = useClipboard({ timeout: 500 });

  const backButtonHandler = () => {
    navigate(-1);
  };

  return (
    <>
      {" "}
      <Modal
        centered
        opened={creating}
        onClose={() => !creating}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        withCloseButton={false}
        overlayOpacity={0.5}
        size={320}
      >
        <Box sx={{ padding: "20px" }}>
          <Group>
            <Container
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px",
              }}
            >
              <Loader />
              <ProgressText mt={"lg"}>{progressMessage}</ProgressText>
            </Container>
          </Group>
        </Box>
      </Modal>
      <Container className={classes.box}>
        <Paper className={classes.formContainer} withBorder>
          <BackButton label="Back to Home" onClick={backButtonHandler} />
          <Group mb={30}>
            <Title>Install MetaMask Snap</Title>
          </Group>
         
           
          {!state.filecoinSnap.isInstalled ?
                    <MetaMaskConnector /> :

          <>
          <Notification
          icon={<IconCheck size={25} />}
          color="green"
          sx={{ width: "100%", boxShadow: "none" }}
          disallowClose
        >
          Snap has been installed successfully. 
        </Notification>
        
        <Box sx={{ padding: "20px" }}>
        <Alert icon={<IconCheck size={32} />} title="MetaMask connected!" color="green" radius="lg">
            MetaMask snap is successfully installed and your MetaMask account is now connected.
            <TextInput
          label="Connected Wallet"
          width={"100%"}
          value={address}
          placeholder={address}
          mt={40}
          mb={20}
          rightSection={
            <IconCopy
              size={18}
              cursor="pointer"
              style={{ stroke: "#495057" }}
              color={clipboard.copied ? "teal" : "#eee"}
              onClick={() => {
                clipboard.copy(address);
                showNotification({
                  message: "Wallet Address has been copied",
                });
              }}
            />
          }
        />

Proceed to the next step to create a recovery plan for your wallet.
            </Alert>
            </Box>
      
        </>
                } 

          


          

          <Button
           mt={20}
           mb={20}
            className={classes.button}
            loading={creating}
            disabled={!state.filecoinSnap.isInstalled }
            onClick={() => {
              setCreateStep(2);;
            }}
          >
            Next
          </Button>
        </Paper>

        <Container className={classes.progressbox}>
          <ProgressStatus
            title="Install Snap"
            description="Install the Safient Snap by connecting MetaMask and providing the required permissions."
            status={state.filecoinSnap.isInstalled ? 60 : 40}
          />
        </Container>
      </Container>
    </>
  );
};
