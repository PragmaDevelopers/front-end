"use client";
import { ProfilePicture } from "@/app/components/dashboard/user/ProfilePicture";
import ImageUploader from "@/app/components/global/ImageUploader";
import { useUserContext } from "@/app/contexts/userContext";
import { userData, userValueDT } from "@/app/types/KanbanTypes";
import { API_BASE_URL, NATIONALITIES_ARRAY } from "@/app/utils/variables";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
    const router = useRouter();
    const { userValue } = useUserContext();
    const [profilePictureSource, setProfilePictureSource] = useState<string>(userValue.profileData.profilePicture as string);
    const [showChangeWarning, setShowChangeWarning] = useState<boolean>(false);
    useEffect(() => {
        setShowChangeWarning(false);
    }, [setShowChangeWarning]);


    const handleProfilePictureSource = (arg0: string) => {
        setProfilePictureSource(arg0);
        console.log(arg0);
    }

    const checkNationality = (value: string): boolean => {
        for (let index = 0; index < NATIONALITIES_ARRAY.length; index++) {
            const element: string = NATIONALITIES_ARRAY[index];
            if (element.toLowerCase() === value.toLowerCase()) {
                return true;
            }
        }
         return false;
    }

    const handleFormSubmit = (e: any) => {
        e.preventDefault();
        let subPfp: string = profilePictureSource;
        let subEmail: string = e.target.emailPessoal.value;
        let subPasswd: string = e.target.senhaPessoal.value;
        let subRePasswd: string = e.target.reSenhaPessoal.value;
        let subNat: string = e.target.nationality.value;
        let subGender: string = e.target.generoPessoal.value;
        let subName: string = e.target.namePessoal.value;

        console.log(profilePictureSource);
        console.log("subPfp",subPfp);
        console.log("subEmail",subEmail);
        console.log("subPasswd",subPasswd);
        console.log("subRePasswd",subRePasswd);
        console.log("subNat",subNat);
        console.log("subGender",subGender);
        console.log("subName",subName);

        let sendObj: {[Key: string]: string} = {}

        const compareObj: {[Key: string]: string} = {
            "name": subName,
            "email": subEmail,
            "password": subPasswd,
            "nationality": subNat,
            "gender": subGender,
            "profilePicture": subPfp,
        }

        for (let [key, value] of Object.entries(userValue.profileData)) {
            if (compareObj[key] !== value) {
                sendObj[key] = compareObj[key]
                console.log(sendObj);
            }
        }

        const headers = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userValue.token}`,
            },
            body: JSON.stringify(sendObj),
        }

        fetch(`${API_BASE_URL}/api/private/user/profile`, headers);
        setShowChangeWarning(true);

        /*
        let newUserObject: profileData = userValue.profileData;
        newUserObject.email = subEmail;
        newUserObject.name = subName;
        newUserObject.nationality = subNat;
        newUserObject.gender = subGender;
        newUserObject.profilePicture = subPfp;
        const newUserValue: userValueDT = {
            token: userValue.token,
            usersList: userValue.usersList,
            profileData: newUserObject,
        };

        setUserValue(newUserValue);
        */
    }

    return (
        <main className="w-full h-full bg-neutral-100 overflow-hidden">
            <div className="flex flex-row justify-center items-center relative my-2">
                <button className="absolute left-4 hover:left-2 transition-all" type="button" onClick={() => router.back()}><ArrowLeftIcon className="aspect-square w-8 stroke-1 stroke-neutral-900 fill-neutral-900" /></button>
                <h1 className="font-bold text-2xl text-neutral-900">Configurações</h1>
            </div>
            <div className={`${showChangeWarning ? 'flex' : 'hidden'} w-full h-fit justify-center items-center my-2`}>
                <h1 className="w-fit h-fit text-lg">Você verá as mudanças na próxima vez que fizer login.</h1>
            </div>
            <div className="mt-4 flex flex-col items-center justify-between relative p-4">
                <div className="bg-neutral-50 rounded-lg drop-shadow-md p-4 flex flex-row justify-center items-center ml-4">
                    <ProfilePicture className="aspect-square w-24 mr-4" size={512} source={userValue.profileData?.profilePicture} />
                    <div>
                        <h1 className="text-lg font-bold text-neutral-900 mb-1">{userValue.profileData.name}</h1>
                        <h2 className="text-neutral-700 text-sm my-0.5">{userValue.profileData.email}</h2>
                        {/*<h3 className="text-blue-500 hover:text-blue-700 transition-all text-sm my-0.5">Configurar perfil</h3>*/}
                    </div>
                </div>
                <form className="m-4 w-[28rem]" onSubmit={handleFormSubmit}>
                    <div className="bg-neutral-50 px-2 pt-2 pb-8 rounded-lg m-4 drop-shadow-md overflow-auto max-h-[20rem]">
                        <h1 className="font-bold text-xl mb-2 text-neutral-900">Informações Pessoais</h1>
                        <div className="flex flex-col justify-center items-center w-full">
                            <h2 className="w-full text-left font-bold mb-1">Imagem de Perfil</h2>
                            <ImageUploader callback={handleProfilePictureSource} />
                            <button type="submit"
                                className="m-2 p-2 bg-neutral-50 drop-shadow-md rounded-md text-green-600 hover:bg-green-600 hover:text-neutral-50 hover:scale-110 transition-all">
                                Salvar
                            </button>
                        </div>
                        <div className="flex w-full justify-center items-center my-4">
                            <hr className="w-[90%] bg-neutral-100" />
                        </div>
                        <div className="flex flex-col justify-center items-center w-full">
                            <h2 className="w-full text-left font-bold mb-1">Nome</h2>
                            <input defaultValue={userValue.profileData.name} name="namePessoal" id="namePessoal" type="text" className="bg-neutral-100 border-none outline-none p-2 shadow-inner rounded-md w-full" placeholder="Insira seu nome" />
                            <button type="submit"
                                className="m-2 p-2 bg-neutral-50 drop-shadow-md rounded-md text-green-600 hover:bg-green-600 hover:text-neutral-50 hover:scale-110 transition-all">
                                Salvar
                            </button>
                        </div>
                        <div className="flex w-full justify-center items-center my-4">
                            <hr className="w-[90%] bg-neutral-100" />
                        </div>

                        <div className="flex flex-col justify-center items-center w-full">
                            <h2 className="w-full text-left font-bold mb-1">Email</h2>
                            <input defaultValue={userValue.profileData.email} name="emailPessoal" id="emailPessoal" type="email" className="bg-neutral-100 border-none outline-none p-2 shadow-inner rounded-md w-full" placeholder="Insira um email" />
                            <button type="submit"
                                className="m-2 p-2 bg-neutral-50 drop-shadow-md rounded-md text-green-600 hover:bg-green-600 hover:text-neutral-50 hover:scale-110 transition-all">
                                Salvar
                            </button>
                        </div>
                        <div className="flex w-full justify-center items-center my-4">
                            <hr className="w-[90%] bg-neutral-100" />
                        </div>
                        <div className="flex flex-col justify-center items-center w-full">
                            <h2 className="w-full text-left font-bold mb-1">Senha</h2>
                            <input name="senhaPessoal" id="senhaPessoal" type="password" autoComplete="new-password"
                                className="bg-neutral-100 border-none outline-none p-2 shadow-inner rounded-md w-full my-1" placeholder="Insira sua senha" />
                            <input name="reSenhaPessoal" id="reSenhaPessoal" type="password" autoComplete="new-password"
                                className="bg-neutral-100 border-none outline-none p-2 shadow-inner rounded-md w-full my-1" placeholder="Re-insira sua senha" />
                            <button type="submit"
                                className="m-2 p-2 bg-neutral-50 drop-shadow-md rounded-md text-green-600 hover:bg-green-600 hover:text-neutral-50 hover:scale-110 transition-all">
                                Salvar
                            </button>
                        </div>
                        <div className="flex w-full justify-center items-center my-4">
                            <hr className="w-[90%] bg-neutral-100" />
                        </div>
                        <div className="flex flex-col justify-center items-center w-full">
                            <h2 className="w-full text-left font-bold mb-1">Nacionalidade</h2>
                            <select defaultValue={userValue.profileData.nationality} id="nationality" name="nationality" className="bg-neutral-100 border-none outline-none p-2 shadow-inner rounded-md w-full my-1">
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
                                <option value="BR">BR - Brasil</option>
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
                            <button type="submit"
                                className="m-2 p-2 bg-neutral-50 drop-shadow-md rounded-md text-green-600 hover:bg-green-600 hover:text-neutral-50 hover:scale-110 transition-all">
                                Salvar
                            </button>
                        </div>
                        <div className="flex w-full justify-center items-center my-4">
                            <hr className="w-[90%] bg-neutral-100" />
                        </div>
                        <div className="flex flex-col justify-center items-center w-full">
                            <h2 className="w-full text-left font-bold mb-1">Gênero</h2>
                            <input name="generoPessoal" id="generoPessoal" type="input"  defaultValue={userValue.profileData.gender}
                                className="bg-neutral-100 border-none outline-none p-2 shadow-inner rounded-md w-full" placeholder="Insira seu genero" />
                            <button type="submit"
                                className="m-2 p-2 bg-neutral-50 drop-shadow-md rounded-md text-green-600 hover:bg-green-600 hover:text-neutral-50 hover:scale-110 transition-all">
                                Salvar
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    );
}
