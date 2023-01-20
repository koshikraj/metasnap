import {
  Alert,
  Badge,
  Button,
  Center,
  Container,
  Group,
  Stack,
  Text,
  Paper,
  Box,
  Input,
} from "@mantine/core";
import { BackButton, Image, SendModal, Title } from "../../components";
import {
  IconAlertCircle,
  IconAlertTriangle,
  IconArrowUp,
  IconCopy,
  IconNotification,
  IconSettings,
} from "@tabler/icons";
import { useStyles } from "./voucher-details.screen.styles";
import useVoucherStore from "store/voucher/voucher.store";
import { useState } from "react";
import { Confetti } from "components/primitives/confetti/confetti.component";
import { VoucherDetailsShimmer } from "./voucher-details.shimmer";
import { wrap } from "module";
import { Actions } from "./components/actions.component";
import { Activity } from "./components/activitity.component";

export const VoucherDetailsScreen = () => {
  const { classes } = useStyles();
  const [sendModal, setSendModal] = useState(false);
  const { voucherDetails, fetching } = useVoucherStore((state: any) => state);

  const formatExpiration = () => {
    const presentTime = Date.now() / 1000;

    const expiresOn = ` ${new Date(
      voucherDetails.timeStamp + voucherDetails.expirationTime * 1000
    ).toLocaleString()} ( ${Intl.DateTimeFormat().resolvedOptions().timeZone})`;
    const expirationTime =
      voucherDetails.timeStamp / 1000 +
      voucherDetails.expirationTime -
      presentTime;

    return {
      days: Math.floor(expirationTime / 86400),
      hours: Math.ceil((expirationTime % 86400) / 3600),
      expired: expirationTime <= 0,
      expiresOn: expiresOn,
    };
  };

  return (
    <>
      {fetching ? (
        <VoucherDetailsShimmer />
      ) : (
        <>
          {/* <Confetti /> */}
          <SendModal
            sendModal={sendModal}
            setSendModal={setSendModal}
            value={voucherDetails.amount}
            wallet={voucherDetails.wallet}
          />
          <Paper withBorder className={classes.voucherDetailsContainer}>
            <Container className={classes.formContainer}>
              <Box mt={20}>
                <BackButton label="Go Back" />
              </Box>
              <Container sx={{ padding: 0, marginBottom: "32px" }}>
                <Group
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                  }}
                >
                  <Title text="Wallet Name" />
                  <Box
                    sx={{
                      backgroundColor: "#EDF7F5",
                      padding: "4px 16px",
                      borderRadius: "4px",
                    }}
                  >
                    <Text color={"green"}>Network name</Text>
                  </Box>
                  <Group>
                    <IconNotification />
                    <IconSettings />
                  </Group>
                </Group>
              </Container>

              <Stack>
                <Center mt={20}>
                  <Group>
                    <Text>0x9264c4Dd3Ef78Ac7D7Fc37605B6a870a2803dc3B</Text>
                    <IconCopy />
                  </Group>
                </Center>

                <Center mt={20} mb={20}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                    }}
                  >
                    <Text weight={600} sx={{ fontSize: "40px" }}>
                      20
                    </Text>
                    <Text size="sm">Eth</Text>
                  </Box>
                </Center>

                <Actions />

                <Activity />
              </Stack>
            </Container>
          </Paper>
        </>
      )}
    </>
  );
};
