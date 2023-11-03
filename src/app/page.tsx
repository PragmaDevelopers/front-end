"use client";
import { ExclamationCircleIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { hashString } from "./utils/security";
import { useRouter } from "next/navigation";

interface InfoScreenProps {
    emailState: boolean;
    passwordState: boolean;
    formSubmit: boolean;
}

function InfoScreen(props: InfoScreenProps) {
    const baseStyle: string = "w-max absolute top-0 z-10 select-none";

    if (!props.passwordState && !props.emailState) {
        return (
            <div className={baseStyle}>
                <h1 className="text-2xl font-semibold text-neutral-950">Bem-Vindo(a)!</h1>
                <h2 className="text-lg text-neutral-500">Insira suas credenciais para acessar o sistema.</h2>
                <div className="fill-blue-300 flex flex-row justify-start items-center mt-2 bg-blue-50 border-l-2 border-blue-300">
                    <InformationCircleIcon className="stroke-blue-400 fill-blue-100 aspect-square w-6 mr-2" />
                    <h3>Caso não esteja cadastrado, ultilize o botão <span className="bg-neutral-50 p-2 drop-shadow-md rounded-md ml-2 text-neutral-950">Cadastrar-se</span></h3>
                </div>
            </div>
        );
    } else if (!props.passwordState) {
        return (
            <div className={baseStyle}>
                <h1 className="text-2xl font-semibold text-neutral-950">Ops...</h1>
                <h2 className="text-lg text-neutral-500">Algo de ruim aconteceu.</h2>
                <div className="fill-red-300 flex flex-row justify-start items-center mt-2 bg-red-50 border-l-2 border-red-300">
                    <ExclamationCircleIcon className="stroke-red-400 fill-red-100 aspect-square w-6 mr-2" />
                    <h3>Sua senha está incorreta.</h3>
                </div>
            </div>
        );
    } else if (!props.emailState) {
        return (
            <div className={baseStyle}>
                <h1 className="text-2xl font-semibold text-neutral-950">Ops...</h1>
                <h2 className="text-lg text-neutral-500">Algo de ruim aconteceu.</h2>
                <div className="fill-red-300 flex flex-row justify-start items-center mt-2 bg-red-50 border-l-2 border-red-300">
                    <ExclamationCircleIcon className="stroke-red-400 fill-red-100 aspect-square w-6 mr-2" />
                    <h3>Seu email está incorreto.</h3>
                </div>
            </div>
        );
    } else {
        return (
            <div className={baseStyle}>
                <h1 className="text-2xl font-semibold text-neutral-950">Ops...</h1>
                <h2 className="text-lg text-neutral-500">Algo de ruim aconteceu.</h2>
                <div className="fill-red-300 flex flex-row justify-start items-center mt-2 bg-red-50 border-l-2 border-red-300">
                    <ExclamationCircleIcon className="stroke-red-400 fill-red-100 aspect-square w-6 mr-2" />
                    <h3>Seu email e sua senha estão incorretos.</h3>
                </div>
            </div>
        );
    }
}

export default function Page() {
    const [cadastrarSe, setCadastrarSe] = useState<boolean>(false);
    const [passwordCheck, setPasswordCheck] = useState<boolean>(false);
    const [emailCheck, setEmailCheck] = useState<boolean>(false);
    const [userCanLogin, setUserCanLogin] = useState<boolean>(false);
    const [formFirstSubmit, setFormFirstSubmit] = useState<boolean>(false);
    const switchCadastrarSe = () => setCadastrarSe(!cadastrarSe);
    const router = useRouter();

    const loginUser = (e: any) => {
        e.preventDefault();
        setFormFirstSubmit(true);

        const useremail: string = hashString(e?.target?.useremail?.value);
        const userpassword: string = hashString(e?.target?.userpassword?.value);
        let emailcheck: boolean = false;
        let passwcheck: boolean = false;
        if (useremail === "1e23d461552b906fea005f95e067816dc68124b4e9966d9898765a09b327e0ca") {
            setEmailCheck(true);
            emailcheck = true;
        }
        if (userpassword === "c775e7b757ede630cd0aa1113bd102661ab38829ca52a6422ab782862f268646") {
            setPasswordCheck(true);
            passwcheck = true;
        }

        if (emailcheck && passwcheck) {
            setUserCanLogin(true);
        }

        e.target.reset();
    }

    if (userCanLogin) {
        router.push("/dashboard");
        return;
    }

    return (
        <main className="bg-neutral-50 text-neutral-950 flex flex-row justify-center items-center w-screen h-screen transition-all">
            <div className="h-[90%] w-[60%] relative flex justify-center items-center">
                <InfoScreen emailState={emailCheck} passwordState={passwordCheck} formSubmit={formFirstSubmit} />
                <form className="flex flex-col items-center mb-4 h-48" onSubmit={loginUser}>
                    {cadastrarSe ? (
                        <div className="h-fit bg-neutral-50 drop-shadow-md rounded-md p-2 border-neutral-200 border-[1px]">
                            <div className="flex flex-col">
                                <input type="text" placeholder="Insira seu nome" className="form-input bg-neutral-100 shadow-inner my-1 border-[1px] border-neutral-200 rounded-md p-1" />
                                <input type="email" placeholder="Insira seu email" className="form-input bg-neutral-100 shadow-inner my-1 border-[1px] border-neutral-200 rounded-md p-1" />
                                <select className="bg-neutral-100 border-none outline-none p-2 shadow-inner rounded-md w-full my-1" placeholder="Selecione sua nacionalidade">
                                    <option value="AF">AF - Afeganistão</option>
                                    <option value="ZA">ZA - África do Sul</option>
                                    <option value="AL">AL - Albânia</option>
                                    <option value="DE">DE - Alemanha</option>
                                    <option value="AD">AD - Andorra</option>
                                    <option value="AO">AO - Angola</option>
                                    <option value="AG">AG - Antígua e Barbuda</option>
                                    <option value="SA">SA - Arábia Saudita</option>
                                    <option value="DZ">DZ - Argélia</option>
                                    <option value="AR">AR - Argentina</option>
                                    <option value="AM">AM - Armênia</option>
                                    <option value="AU">AU - Austrália</option>
                                    <option value="AT">AT - Áustria</option>
                                    <option value="AZ">AZ - Azerbaijão</option>
                                    <option value="BS">BS - Bahamas</option>
                                    <option value="BD">BD - Bangladesh</option>
                                    <option value="BB">BB - Barbados</option>
                                    <option value="BH">BH - Barein</option>
                                    <option value="BY">BY - Belarus</option>
                                    <option value="BE">BE - Bélgica</option>
                                    <option value="BZ">BZ - Belize</option>
                                    <option value="BJ">BJ - Benin</option>
                                    <option value="BO">BO - Bolívia</option>
                                    <option value="BA">BA - Bósnia e Herzegovina</option>
                                    <option value="BW">BW - Botsuana</option>
                                    <option value="BR" selected={true}>BR - Brasil</option>
                                    <option value="BN">BN - Brunei</option>
                                    <option value="BG">BG - Bulgária</option>
                                    <option value="BF">BF - Burkina Faso</option>
                                    <option value="BI">BI - Burundi</option>
                                    <option value="BT">BT - Butão</option>
                                    <option value="CV">CV - Cabo Verde</option>
                                    <option value="CM">CM - Camarões</option>
                                    <option value="KH">KH - Camboja</option>
                                    <option value="CA">CA - Canadá</option>
                                    <option value="QA">QA - Catar</option>
                                    <option value="KZ">KZ - Cazaquistão</option>
                                    <option value="TD">TD - Chade</option>
                                    <option value="CL">CL - Chile</option>
                                    <option value="CN">CN - China</option>
                                    <option value="CY">CY - Chipre</option>
                                    <option value="CO">CO - Colômbia</option>
                                    <option value="KM">KM - Comores</option>
                                    <option value="CG">CG - Congo</option>
                                    <option value="CI">CI - Costa do Marfim</option>
                                    <option value="CR">CR - Costa Rica</option>
                                    <option value="HR">HR - Croácia</option>
                                    <option value="CU">CU - Cuba</option>
                                    <option value="DK">DK - Dinamarca</option>
                                    <option value="DJ">DJ - Djibouti</option>
                                    <option value="DM">DM - Dominica</option>
                                    <option value="EG">EG - Egito</option>
                                    <option value="SV">SV - El Salvador</option>
                                    <option value="AE">AE - Emirados Árabes Unidos</option>
                                    <option value="EC">EC - Equador</option>
                                    <option value="ER">ER - Eritréia</option>
                                    <option value="SK">SK - Eslováquia</option>
                                    <option value="SI">SI - Eslovênia</option>
                                    <option value="ES">ES - Espanha</option>
                                    <option value="US">US - Estados Unidos da América</option>
                                    <option value="EE">EE - Estônia</option>
                                    <option value="SZ">SZ - Eswatini</option>
                                    <option value="ET">ET - Etiópia</option>
                                    <option value="FJ">FJ - Fiji</option>
                                    <option value="PH">PH - Filipinas</option>
                                    <option value="FI">FI - Finlândia</option>
                                    <option value="FR">FR - França</option>
                                    <option value="GA">GA - Gabão</option>
                                    <option value="GM">GM - Gâmbia</option>
                                    <option value="GH">GH - Gana</option>
                                    <option value="GE">GE - Geórgia</option>
                                    <option value="GD">GD - Granada</option>
                                    <option value="GR">GR - Grécia</option>
                                    <option value="GT">GT - Guatemala</option>
                                    <option value="GY">GY - Guiana</option>
                                    <option value="GN">GN - Guiné</option>
                                    <option value="GQ">GQ - Guiné Equatorial</option>
                                    <option value="GW">GW - Guiné-Bissau</option>
                                    <option value="HT">HT - Haiti</option>
                                    <option value="NL">NL - Holanda</option>
                                    <option value="HN">HN - Honduras</option>
                                    <option value="HU">HU - Hungria</option>
                                    <option value="YE">YE - Iêmen</option>
                                    <option value="MH">MH - Ilhas Marshall</option>
                                    <option value="SB">SB - Ilhas Salomão</option>
                                    <option value="IN">IN - Índia</option>
                                    <option value="ID">ID - Indonésia</option>
                                    <option value="IR">IR - Irã</option>
                                    <option value="IQ">IQ - Iraque</option>
                                    <option value="IE">IE - Irlanda</option>
                                    <option value="IS">IS - Islândia</option>
                                    <option value="IL">IL - Israel</option>
                                    <option value="IT">IT - Itália</option>
                                    <option value="JM">JM - Jamaica</option>
                                    <option value="JP">JP - Japão</option>
                                    <option value="JO">JO - Jordânia</option>
                                    <option value="KI">KI - Kiribati</option>
                                    <option value="KW">KW - Kuwait</option>
                                    <option value="LA">LA - Laos</option>
                                    <option value="LS">LS - Lesoto</option>
                                    <option value="LV">LV - Letônia</option>
                                    <option value="LB">LB - Líbano</option>
                                    <option value="LR">LR - Libéria</option>
                                    <option value="LY">LY - Líbia</option>
                                    <option value="LI">LI - Liechtenstein</option>
                                    <option value="LT">LT - Lituânia</option>
                                    <option value="LU">LU - Luxemburgo</option>
                                    <option value="MK">MK - Macedônia do Norte</option>
                                    <option value="MG">MG - Madagáscar</option>
                                    <option value="MY">MY - Malásia</option>
                                    <option value="MW">MW - Malauí</option>
                                    <option value="MV">MV - Maldivas</option>
                                    <option value="ML">ML - Mali</option>
                                    <option value="MT">MT - Malta</option>
                                    <option value="MA">MA - Marrocos</option>
                                    <option value="MU">MU - Maurício</option>
                                    <option value="MR">MR - Mauritânia</option>
                                    <option value="MX">MX - México</option>
                                    <option value="MM">MM - Mianmar</option>
                                    <option value="FM">FM - Micronésia</option>
                                    <option value="MZ">MZ - Moçambique</option>
                                    <option value="MD">MD - Moldávia</option>
                                    <option value="MC">MC - Mônaco</option>
                                    <option value="MN">MN - Mongólia</option>
                                    <option value="ME">ME - Montenegro</option>
                                    <option value="NA">NA - Namíbia</option>
                                    <option value="NR">NR - Nauru</option>
                                    <option value="NP">NP - Nepal</option>
                                    <option value="NI">NI - Nicarágua</option>
                                    <option value="NE">NE - Níger</option>
                                    <option value="NG">NG - Nigéria</option>
                                    <option value="NO">NO - Noruega</option>
                                    <option value="NZ">NZ - Nova Zelândia</option>
                                    <option value="OM">OM - Omã</option>
                                    <option value="PW">PW - Palau</option>
                                    <option value="PA">PA - Panamá</option>
                                    <option value="PG">PG - Papua Nova Guiné</option>
                                    <option value="PK">PK - Paquistão</option>
                                    <option value="PY">PY - Paraguai</option>
                                    <option value="PE">PE - Peru</option>
                                    <option value="PL">PL - Polônia</option>
                                    <option value="PT">PT - Portugal</option>
                                    <option value="KE">KE - Quênia</option>
                                    <option value="KG">KG - Quirguistão</option>
                                    <option value="GB">GB - Reino Unido</option>
                                    <option value="CF">CF - República Centro Africana</option>
                                    <option value="KR">KR - República da Coréia</option>
                                    <option value="CD">CD - República Democrática do Congo</option>
                                    <option value="DO">DO - República Dominicana</option>
                                    <option value="KP">KP - República Popular Democrática da Coréia</option>
                                    <option value="CZ">CZ - República Tcheca</option>
                                    <option value="RO">RO - Romênia</option>
                                    <option value="RW">RW - Ruanda</option>
                                    <option value="RU">RU - Rússia (Federação Russa)</option>
                                    <option value="WS">WS - Samoa</option>
                                    <option value="SM">SM - San Marino</option>
                                    <option value="LC">LC - Santa Lúcia</option>
                                    <option value="KN">KN - São Cristóvão e Nevis</option>
                                    <option value="ST">ST - São Tomé e Príncipe</option>
                                    <option value="VC">VC - São Vicente e Granadinas</option>
                                    <option value="SC">SC - Seichelles</option>
                                    <option value="SN">SN - Senegal</option>
                                    <option value="SL">SL - Serra Leoa</option>
                                    <option value="RS">RS - Sérvia</option>
                                    <option value="SG">SG - Singapura</option>
                                    <option value="SY">SY - Síria</option>
                                    <option value="SO">SO - Somália</option>
                                    <option value="LK">LK - Sri Lanka</option>
                                    <option value="SD">SD - Sudão</option>
                                    <option value="SS">SS - Sudão do Sul</option>
                                    <option value="SE">SE - Suécia</option>
                                    <option value="CH">CH - Suíça</option>
                                    <option value="SR">SR - Suriname</option>
                                    <option value="TJ">TJ - Tadjiquistão</option>
                                    <option value="TH">TH - Tailândia</option>
                                    <option value="TZ">TZ - Tanzânia</option>
                                    <option value="TL">TL - Timor Leste</option>
                                    <option value="TG">TG - Togo</option>
                                    <option value="TO">TO - Tonga</option>
                                    <option value="TT">TT - Trinidad e Tobago</option>
                                    <option value="TN">TN - Tunísia</option>
                                    <option value="TM">TM - Turcomenistão</option>
                                    <option value="TR">TR - Turquia</option>
                                    <option value="TV">TV - Tuvalu</option>
                                    <option value="UA">UA - Ucrânia</option>
                                    <option value="UG">UG - Uganda</option>
                                    <option value="UY">UY - Uruguai</option>
                                    <option value="UZ">UZ - Uzbequistão</option>
                                    <option value="VU">VU - Vanuatu</option>
                                    <option value="VE">VE - Venezuela</option>
                                    <option value="VN">VN - Vietnã</option>
                                    <option value="ZM">ZM - Zâmbia</option>
                                    <option value="ZW">ZW - Zimbábue</option>
                                </select>


                                <input type="text" placeholder="Insira seu genero" className="form-input bg-neutral-100 shadow-inner my-1 border-[1px] border-neutral-200 rounded-md p-1" />
                            </div>
                            <div className="flex flex-row justify-between items-center">
                                <input type="password" placeholder="Insira sua senha" className="form-input bg-neutral-100 shadow-inner my-1 border-[1px] border-neutral-200 rounded-md p-1 mr-1" autoComplete="current-password" />
                                <input type="password" placeholder="Re-insira sua senha" className="form-input bg-neutral-100 shadow-inner my-1 border-[1px] border-neutral-200 rounded-md p-1 ml-1" autoComplete="current-password" />
                            </div>
                        </div>
                    ) : (
                        <div className="w-96 flex flex-col bg-neutral-50 drop-shadow-md rounded-md p-2 border-neutral-200 border-[1px]">
                            <input name="useremail" type="email" placeholder="Insira seu email" className="form-input bg-neutral-100 shadow-inner my-1 border-[1px] border-neutral-200 rounded-md p-1" />
                            <input name="userpassword" type="password" placeholder="Insira sua senha" className="form-input bg-neutral-100 shadow-inner my-1 border-[1px] border-neutral-200 rounded-md p-1" autoComplete="current-password" />
                        </div>
                    )}
                    <div className="w-96 flex flex-row justify-between items-center mt-4">
                        <button className="border-neutral-200 border-[1px] text-neutral-950 bg-neutral-50 p-2 drop-shadow-md rounded-md ml-2 hover:bg-neutral-100 hover:text-neutral-950 hover:scale-110 transition-all" type="submit">{cadastrarSe ? 'Finalizar Cadastro' : 'Entrar'}</button>
                        <button className="border-neutral-200 border-[1px] text-neutral-950 bg-neutral-50 p-2 drop-shadow-md rounded-md ml-2 hover:bg-neutral-100 hover:text-neutral-950 hover:scale-110 transition-all" type="button" onClick={switchCadastrarSe}>{cadastrarSe ? 'Voltar' : 'Cadastrar-se'}</button>
                    </div>
                </form>
            </div>
        </main>
    );
}
