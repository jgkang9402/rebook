import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import SearchIcon from "@mui/icons-material/Search";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import NavigateLink from "../../components/common/NavigateLink";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { serverTimestamp, setDoc, doc } from "firebase/firestore";
import { auth, db } from "../../firebase/Firebase";
import { InputAdornment } from "@mui/material";
import { useNavigate } from "react-router-dom";
import TextBox from "../../components/common/TextBox";
import NormalModalCont from "components/Modal/NormalModalCont";
import SearchModal from "components/Modal/SearchModal";

const theme = createTheme();

export default function SignUpPage() {
  const [open, setOpen] = useState(false);
  const [searchData, setSearchData] = useState<null | {
    bookName: string;
    bookIsbn: string;
  }>(null);
  const navigate = useNavigate();
  const propsData = [
    {
      name: "email",
      helperText: "Email",
      type: "email",
      xs: 12,
    },
    {
      name: "password",
      helperText: "Password",
      type: "password",
      xs: 12,
    },
    {
      name: "name",
      helperText: "Name",
      type: "name",
      xs: 12,
    },
    {
      name: "birth",
      helperText: "Birth",
      type: "date",
      xs: 12,
      sm: 6,
      inputProps: {
        inputProps: {
          max: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
            .toISOString()
            .split("T")[0],
        },
      },
    },
    {
      name: "favoBook",
      helperText: "Favorite Book",
      type: "text",
      placeholder: "책을 검색 해주세요.",
      xs: 12,
      sm: 6,
      inputProps: {
        endAdornment: (
          <InputAdornment position="start">
            <SearchIcon
              sx={{ cursor: "pointer" }}
              onClick={() => clickBookSearchBox()}
            />
          </InputAdornment>
        ),
        inputProps: {
          onFocus: (e: React.FocusEvent<HTMLInputElement>) =>
            (e.target.placeholder = "돋보기를 클릭해주세요."),
          onBlur: (e: React.FocusEvent<HTMLInputElement>) =>
            (e.target.placeholder = "책을 검색 해주세요."),
        },
      },
      value: searchData?.bookName,
      isUncontrolInput: true,
    },
  ];

  const getPickBookData = (bookIsbn: string, bookName: string) => {
    console.log("@@@@@@@", bookIsbn, bookName);
    setSearchData({ bookName, bookIsbn });
    setOpen(false);
  };
  const clickBookSearchBox = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleSubmit = async (userInfo: any) => {
    console.log("로그인@@@@@@@@", userInfo);
    createUserWithEmailAndPassword(auth, userInfo.email, userInfo.password)
      .then((res) => {
        console.log(res);
        setDoc(doc(db, "users", res.user.uid), {
          email: userInfo.email,
          birth: userInfo.birth,
          name: userInfo.name,
          favoBook: userInfo.favoBook,
          joined: serverTimestamp(),
        });
        console.log("submit");
        navigate("/signin");
      })
      .catch((err) => console.log(err));
  };
  const getFormData = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const joinFormData = new FormData(event.currentTarget);
    if (
      joinFormData.get("email") === "" ||
      joinFormData.get("password") === "" ||
      joinFormData.get("name") === "" ||
      joinFormData.get("birth") === "" ||
      joinFormData.get("favoBook") === ""
    ) {
      alert("입력폼을 전부 작성해주세요.");
      return;
    }
    const email = joinFormData.get("email") as string;
    const password = joinFormData.get("password") as string;
    const name = joinFormData.get("name") as string;
    const birth = joinFormData.get("birth") as string;
    // const favoBook = joinFormData.get("favoBook") as string;
    const userInfo = {
      email: email,
      password: password,
      name: name,
      birth: birth,
      favoBook: searchData?.bookIsbn,
    };
    handleSubmit(userInfo);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container
        maxWidth="xs"
        // sx={{ backgroundColor: "#ACB1D6" }}
      >
        {/* <CssBaseline /> */}
        <Box
          sx={{
            // marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1 }}>
            <AssignmentIndIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            회원가입
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={getFormData}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              {propsData.map((item, idx) => {
                return (
                  <Grid item key={idx} xs={item.xs} sm={item.sm}>
                    <TextBox properties={item} />
                  </Grid>
                );
              })}
              <NormalModalCont open={open} handleClose={handleClose}>
                <SearchModal
                  open={open}
                  setOpen={setOpen}
                  getPickBookData={getPickBookData}
                />
              </NormalModalCont>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              color="secondary"
            >
              회원가입
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <NavigateLink path={"/signin"} color="grey">
                  이미 회원이신가요? 로그인
                </NavigateLink>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

/* 
  // 기존시도코드
  // const email: string = joinFormData.get("email") ?? "";
  // const password: string = joinFormData.get("password") ?? "";
  // const birth: string = joinFormData.get("birth") ?? "";
  // const favoBook: string = joinFormData.get("favoBook") ?? "";

  // 정상동작
  const email = joinFormData.get("email") as string;
  const password = joinFormData.get("password") as string;
  const birth = joinFormData.get("birth") as string;
  const favoBook = joinFormData.get("favoBook") as string;
  // 정상동작
  // const email: string = joinFormData.get("email")?.toString() ?? "";
  // const password: string = joinFormData.get("password")?.toString() ?? "";
  // const birth: string = joinFormData.get("birth")?.toString() ?? "";
  // const favoBook: string = joinFormData.get("favoBook")?.toString() ?? "";

*/
