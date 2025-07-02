"use client"

import { useState, useEffect } from "react";
import Head from "next/head";
import { getCurrentVoting, addVote } from "@/services/Web3Service";
import { useRouter } from "next/navigation";

export default function Vote() {

  const {push} = useRouter();

  const DEFAULT_OPTION = { name: "Carregando...", image: "https://cdn.pixabay.com/photo/2023/10/03/10/49/anonymous-8291223_1280.png" };  

  const [message, setMessage] = useState("");
  const [voting, setVoting] = useState({ maxDate: Date.now() });
  const [option1, setOption1] = useState(DEFAULT_OPTION);
  const [option2, setOption2] = useState(DEFAULT_OPTION);
  const [showVotes, setShowVotes] = useState(0);


  useEffect(() => {
    if(!localStorage.getItem("wallet")) return push("/");

    getCurrentVoting()
        .then(voting => {
            console.log(voting);
            setVoting(voting);
            setOption1(getOption(voting.option1));
            setOption2(getOption(voting.option2));
        })
        .catch(err => {
            console.error(err);
            setMessage(err.message);
        })
  }, [])

  function btnLoginClick(){
    doLogin()
      .then(account => setMessage(account))
      .catch(err => {
        console.error(err);
        setMessage(err.message);
      })
  }

  function getOption(option){
    switch(option){
        case "Maykon": return { name: "MaykonBatista", image: "https://scontent-gru2-1.xx.fbcdn.net/v/t1.6435-9/41291222_2202380066503695_3703567934476517376_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=5bbf69&_nc_ohc=MldXrwDLr2oQ7kNvwEKE4ee&_nc_oc=AdntuKff1kNOPDnaQYgPgWlq-ZnskzduPEh_sIsmx3F0JkawU8-apT-3s1OYMzZnbl0&_nc_zt=23&_nc_ht=scontent-gru2-1.xx&_nc_gid=524_4FxNpoyzhqKC1kHW5w&oh=00_AfNrA7CrchBK2emVO16iy4xlsS3JkrkTEBRtUF8JzY7plA&oe=6886510E" };
        case "Ana": return { name: "AnaBortot", image: "https://scontent-gru1-2.xx.fbcdn.net/v/t39.30808-6/475137167_9025834760832236_999440685326592758_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_ohc=XUSrXEuOBgsQ7kNvwF-Kcsh&_nc_oc=AdkWHImg2Exq1jHA7SpI8zH6ml8XJNR_XGt_wWqNHvIrn9fNS5oRdTVTel4DTs3mXI0&_nc_zt=23&_nc_ht=scontent-gru1-2.xx&_nc_gid=iN_ZG-i96UEnfSM_JDyaew&oh=00_AfP1ED3ddToXVACsuUo8quPD6ocaeYbApUDDPtph_rL3xA&oe=68649176" };
        default: return DEFAULT_OPTION;
    }
  }

  function btnVote2Click(){
    setMessage("Conectando na carteira... aguarde...")
    addVote(2)
        .then(() => {
            setShowVotes(2);
            setMessage("Resultados parciais sujeitos a alteração minuto a minuto.");
        })
        .catch(err => {
            console.error(err);
            setMessage(err.message);
        })
  }

  function btnVote1Click(){
    setMessage("Conectando na carteira... aguarde...")
    addVote(1)
        .then(() => {
            setShowVotes(1);
            setMessage("Resultados parciais sujeitos a alteração minuto a minuto.");
        })
        .catch(err => {
            console.error(err);
            setMessage(err.message);
        })
}

  return (
    <>
      <Head>
        <title>Webbb3 | Votação</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width ,initial-scale=1" />
      </Head>
      <div className="container col-xxl-8 px-4 py-5">
        <div className="row align-items-center">
            <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">Webbb3</h1>
            <p className="lead">Votação on-chain do BBB.</p>
            {
                voting.maxDate > (Date.now() / 1000)
                ? <p className="lead mb-3">Você tem até {new Date(Number(voting.maxDate) * 1000).toString()} para deixar seu voto em um dos participantes para que ele saia do programa.</p>
                : <p className="lead mb-3">Votação encerrada! Confira abaixo os resultados:</p>
            }
        </div>
        <div className="row flex-lg-row-reverse align-items-center g-1 py-5">
            <div className="col-1"></div>
            <div className="col-5">
                <h3 className="my-2 d-block mx-auto" style={{ width: 250 }}>
                    {voting.option2}
                </h3>
                <img src={option2.image} className="d-block mx-auto img-fluid rounded" width={250} height={250} />
                {
                    showVotes > 0 || voting.maxDate < (Date.now() / 1000)
                    ? <button className="btn btn-secondary p-3 my-2 d-block mx-auto" style={{width: 250}} disabled={true}>{showVotes === 2 ? Number(voting.votes2) + 1 : Number(voting.votes2)} votos.</button>
                    : <button className="btn btn-primary p-3 my-2 d-block mx-auto" style={{width: 250}} onClick={btnVote2Click}>Quero que saia esse!</button>
                }                
            </div>
            <div className="col-5">
                <h3 className="my-2 d-block mx-auto" style={{ width: 250 }}>
                    {voting.option1}
                </h3>
                <img src={option1.image} className="d-block mx-auto img-fluid rounded" width={250} height={250} />
                {
                    showVotes > 0 || voting.maxDate < (Date.now() / 1000)
                    ? <button className="btn btn-secondary p-3 my-2 d-block mx-auto" style={{width: 250}} disabled={true}>{showVotes === 1 ? Number(voting.votes1) + 1 : Number(voting.votes1)} votos.</button>
                    : <button className="btn btn-primary p-3 my-2 d-block mx-auto" style={{width: 250}} onClick={btnVote1Click}>Quero que saia esse!</button>
                }                
            </div>
        </div>
        <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
          <p className="col-md-4 mb-0 text-body-secondary">&copy; 2025 Webbb3, Inc</p>
          <ul className="nav col-md-4 justify-content-end">
            <li className="nav-item"><a href="/" className="nav-link px-2 text-body-secondary">Home</a></li>
            <li className="nav-item"><a href="/about" className="nav-link px-2 text-body-secondary">About</a></li>
          </ul>
        </footer>
      </div>
    </>
  );
}
