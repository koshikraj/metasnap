import { Button, Center, Container, Stack } from "@mantine/core";
import { useState } from "react";
import { GenericCard, Image, Title, VoucherCard } from "../../components";
import { RedeemModal } from "../../components/redeem-modal/redeem-modal.component";
import { useStyles } from "./vouchers.screen.styles";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { RoutePath } from "navigation";
import { useStores } from "store";
//@ts-ignore
import EmptyState from "../../assets/images/empty.svg";
import useRecoveryStore from "store/recovery/recovery.store";
import { useServices } from "services";
import { Wallet } from "utils";
import { utils } from "ethers";

export const VouchersScreen = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  let { code } = useParams();
  const wallet = new Wallet();
  const { safeService } = useServices();
  const { accountStore } = useStores();
  const { setFetching, setRecoveryDetails } = useRecoveryStore(
    (state: any) => state
  );

  const [modalActive, setModalActive] = useState(code ? true : false);

  const voucherCardHandler = async (safeId: any) => {
    setFetching(true);
    // todo- add a check for creator and ben
    navigate(RoutePath.recoveryDetails);
    const voucher = await safeService.get(safeId);
    const voucherSafe = await safeService.recover(safeId, "creator");
    const redeemAccount = await wallet.load("polygon", {
      privateKey: voucherSafe.data?.privateKey!,
    });
    if (voucher !== undefined) {
      setRecoveryDetails({
        wallet: wallet,
        amount: utils.formatEther(
          (await redeemAccount.data?.getBalance()!).toString()
        ),
        title: voucher.data?.safeName,
        description: voucher.data?.description,
        expirationTime: voucher.data?.claim.period,
        timeStamp: voucher.data?.timeStamp
      });
      setFetching(false);
      navigate(RoutePath.recoveryDetails);
    }
  };

  return (
    <Container>
      <RedeemModal
        modalActive={modalActive}
        setModalActive={setModalActive}
        title="Redeem Voucher"
      />
      <Container className={classes.voucherScreenContainer}>
        <Container sx={{ padding: 0, marginTop: "42px" }}>
          <Title text="Create Wallet Recovery" />
        </Container>
        <div className={classes.actionsContainer}>
          <GenericCard
            title="Create"
            name="add"
            onClick={() => {
              navigate(RoutePath.createRecovery);
            }}
          />
          <GenericCard
            title="Recover"
            name="redeem"
            onClick={() => setModalActive(true)}
          />
        </div>

        <Title text="My Wallets" />

        <div className={classes.vouchersContainer}>
          {!accountStore._safientUser?.safes.length && (
            <Container>
              <Center>
                <Stack>
                  <Image src={EmptyState} mt={"lg"} />
                  {!accountStore.userSignedIn && <Button
                    className={classes.button}
                    mt={"lg"}
                    onClick={() => navigate(RoutePath.login)}
                  >
                    Login to use MetaSnap
                  </Button>}
                </Stack>
              </Center>
            </Container>
          )}

          {accountStore?.safientUser?.safes.map((v) => (
            <div key={v.safeId}>
              <VoucherCard
                title={v.safeName}
                onClick={() => voucherCardHandler(v.safeId)}
              />
            </div>
          ))}
        </div>
      </Container>
    </Container>
  );
};
