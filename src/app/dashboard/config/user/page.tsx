"use client";
import { ProfilePicture } from "@/app/components/dashboard/user/ProfilePicture";
import ImageUploader from "@/app/components/global/ImageUploader";
import { useUserContext } from "@/app/contexts/userContext";
import { userData, userValueDT } from "@/app/types/KanbanTypes";
import { API_BASE_URL, NATIONALITIES_ARRAY } from "@/app/utils/variables";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
    const router = useRouter();
    const { userValue, updateUserValue } = useUserContext();
    const [profilePictureSource, setProfilePictureSource] = useState<string>(userValue.userData.profilePicture as string);

    const handleProfilePictureSource = (arg0: string) => {
        setProfilePictureSource(arg0)
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
        let subPfp: string = profilePictureSource;
        let subEmail: string = e?.target?.emailPessoal;
        let subPasswd: string = e?.target?.senhaPessoal;
        let subRePasswd: string = e?.target?.reSenhaPessoal;
        let subNat: string = e?.target?.nationality;
        let subGender: string = e?.target?.generoPessoal;
        let subName: string = e?.target?.namePessoal;

        const sendObj = {
            "name": subName,
            "email": subEmail,
            "password": subPasswd,
            "nationality": subNat,
            "gender": subGender,
            "profilePicture": subPfp,
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
        let newUserObject: userData = userValue.userData;
        newUserObject.email = subEmail;
        newUserObject.name = subName;
        newUserObject.nationality = subNat;
        newUserObject.gender = subGender;
        newUserObject.profilePicture = subPfp;
        const newUserValue: userValueDT = {
            token: userValue.token,
            usersList: userValue.usersList,
            userData: newUserObject,
        };

        updateUserValue(newUserValue);
    }

    return (
        <main className="w-full h-full bg-neutral-100 overflow-hidden">
            <div className="flex flex-row justify-center items-center relative my-2">
                <button className="absolute left-4 hover:left-2 transition-all" type="button" onClick={() => router.back()}><ArrowLeftIcon className="aspect-square w-8 stroke-1 stroke-neutral-900 fill-neutral-900" /></button>
                <h1 className="font-bold text-2xl text-neutral-900">Configurações</h1>
            </div>
            <div className="mt-4 flex flex-col items-center justify-between relative p-4">
                <div className="bg-neutral-50 rounded-lg drop-shadow-md p-4 flex flex-row justify-center items-center ml-4">
                    <ProfilePicture className="aspect-square w-24 mr-4" size={512} source={userValue.userData?.profilePicture} />
                    <div>
                        <h1 className="text-lg font-bold text-neutral-900 mb-1">{userValue.userData.name}</h1>
                        <h2 className="text-neutral-700 text-sm my-0.5">{userValue.userData.email}</h2>
                        {/*<h3 className="text-blue-500 hover:text-blue-700 transition-all text-sm my-0.5">Configurar perfil</h3>*/}
                    </div>
                </div>
                <form className="m-4 w-[28rem]" onSubmit={handleFormSubmit}>
                    <div className="bg-neutral-50 px-2 pt-2 pb-8 rounded-lg m-4 drop-shadow-md overflow-auto max-h-[20rem]">
                        <h1 className="font-bold text-xl mb-2 text-neutral-900">Informações Pessoais</h1>
                        <div className="flex flex-col justify-center items-center w-full">
                            <h2 className="w-full text-left font-bold mb-1">Imagem de Perfil</h2>
                            <ImageUploader callback={handleProfilePictureSource} />
                        </div>
                        <div className="flex w-full justify-center items-center my-4">
                            <hr className="w-[90%] bg-neutral-100" />
                        </div>
                        <div className="flex flex-col justify-center items-center w-full">
                            <h2 className="w-full text-left font-bold mb-1">Nome</h2>
                            <input defaultValue={userValue.userData.name} name="namePessoal" id="namePessoal" type="text" className="bg-neutral-100 border-none outline-none p-2 shadow-inner rounded-md w-full" placeholder="Insira seu nome" />
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
                            <input defaultValue={userValue.userData.email} name="emailPessoal" id="emailPessoal" type="email" className="bg-neutral-100 border-none outline-none p-2 shadow-inner rounded-md w-full" placeholder="Insira um email" />
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
                            <select id="nationality" name="nationality" className="bg-neutral-100 border-none outline-none p-2 shadow-inner rounded-md w-full my-1">
                                <option value="AF" selected={checkNationality(userValue.userData.nationality)}>AF - Afeganistão</option>
                                <option value="ZA" selected={checkNationality(userValue.userData.nationality)}>ZA - África do Sul</option>
                                <option value="AL" selected={checkNationality(userValue.userData.nationality)}>AL - Albânia</option>
                                <option value="DE" selected={checkNationality(userValue.userData.nationality)}>DE - Alemanha</option>
                                <option value="AD" selected={checkNationality(userValue.userData.nationality)}>AD - Andorra</option>
                                <option value="AO" selected={checkNationality(userValue.userData.nationality)}>AO - Angola</option>
                                <option value="AG" selected={checkNationality(userValue.userData.nationality)}>AG - Antígua e Barbuda</option>
                                <option value="SA" selected={checkNationality(userValue.userData.nationality)}>SA - Arábia Saudita</option>
                                <option value="DZ" selected={checkNationality(userValue.userData.nationality)}>DZ - Argélia</option>
                                <option value="AR" selected={checkNationality(userValue.userData.nationality)}>AR - Argentina</option>
                                <option value="AM" selected={checkNationality(userValue.userData.nationality)}>AM - Armênia</option>
                                <option value="AU" selected={checkNationality(userValue.userData.nationality)}>AU - Austrália</option>
                                <option value="AT" selected={checkNationality(userValue.userData.nationality)}>AT - Áustria</option>
                                <option value="AZ" selected={checkNationality(userValue.userData.nationality)}>AZ - Azerbaijão</option>
                                <option value="BS" selected={checkNationality(userValue.userData.nationality)}>BS - Bahamas</option>
                                <option value="BD" selected={checkNationality(userValue.userData.nationality)}>BD - Bangladesh</option>
                                <option value="BB" selected={checkNationality(userValue.userData.nationality)}>BB - Barbados</option>
                                <option value="BH" selected={checkNationality(userValue.userData.nationality)}>BH - Barein</option>
                                <option value="BY" selected={checkNationality(userValue.userData.nationality)}>BY - Belarus</option>
                                <option value="BE" selected={checkNationality(userValue.userData.nationality)}>BE - Bélgica</option>
                                <option value="BZ" selected={checkNationality(userValue.userData.nationality)}>BZ - Belize</option>
                                <option value="BJ" selected={checkNationality(userValue.userData.nationality)}>BJ - Benin</option>
                                <option value="BO" selected={checkNationality(userValue.userData.nationality)}>BO - Bolívia</option>
                                <option value="BA" selected={checkNationality(userValue.userData.nationality)}>BA - Bósnia e Herzegovina</option>
                                <option value="BW" selected={checkNationality(userValue.userData.nationality)}>BW - Botsuana</option>
                                <option value="BR" selected={checkNationality(userValue.userData.nationality)}>BR - Brasil</option>
                                <option value="BN" selected={checkNationality(userValue.userData.nationality)}>BN - Brunei</option>
                                <option value="BG" selected={checkNationality(userValue.userData.nationality)}>BG - Bulgária</option>
                                <option value="BF" selected={checkNationality(userValue.userData.nationality)}>BF - Burkina Faso</option>
                                <option value="BI" selected={checkNationality(userValue.userData.nationality)}>BI - Burundi</option>
                                <option value="BT" selected={checkNationality(userValue.userData.nationality)}>BT - Butão</option>
                                <option value="CV" selected={checkNationality(userValue.userData.nationality)}>CV - Cabo Verde</option>
                                <option value="CM" selected={checkNationality(userValue.userData.nationality)}>CM - Camarões</option>
                                <option value="KH" selected={checkNationality(userValue.userData.nationality)}>KH - Camboja</option>
                                <option value="CA" selected={checkNationality(userValue.userData.nationality)}>CA - Canadá</option>
                                <option value="QA" selected={checkNationality(userValue.userData.nationality)}>QA - Catar</option>
                                <option value="KZ" selected={checkNationality(userValue.userData.nationality)}>KZ - Cazaquistão</option>
                                <option value="TD" selected={checkNationality(userValue.userData.nationality)}>TD - Chade</option>
                                <option value="CL" selected={checkNationality(userValue.userData.nationality)}>CL - Chile</option>
                                <option value="CN" selected={checkNationality(userValue.userData.nationality)}>CN - China</option>
                                <option value="CY" selected={checkNationality(userValue.userData.nationality)}>CY - Chipre</option>
                                <option value="CO" selected={checkNationality(userValue.userData.nationality)}>CO - Colômbia</option>
                                <option value="KM" selected={checkNationality(userValue.userData.nationality)}>KM - Comores</option>
                                <option value="CG" selected={checkNationality(userValue.userData.nationality)}>CG - Congo</option>
                                <option value="CI" selected={checkNationality(userValue.userData.nationality)}>CI - Costa do Marfim</option>
                                <option value="CR" selected={checkNationality(userValue.userData.nationality)}>CR - Costa Rica</option>
                                <option value="HR" selected={checkNationality(userValue.userData.nationality)}>HR - Croácia</option>
                                <option value="CU" selected={checkNationality(userValue.userData.nationality)}>CU - Cuba</option>
                                <option value="DK" selected={checkNationality(userValue.userData.nationality)}>DK - Dinamarca</option>
                                <option value="DJ" selected={checkNationality(userValue.userData.nationality)}>DJ - Djibouti</option>
                                <option value="DM" selected={checkNationality(userValue.userData.nationality)}>DM - Dominica</option>
                                <option value="EG" selected={checkNationality(userValue.userData.nationality)}>EG - Egito</option>
                                <option value="SV" selected={checkNationality(userValue.userData.nationality)}>SV - El Salvador</option>
                                <option value="AE" selected={checkNationality(userValue.userData.nationality)}>AE - Emirados Árabes Unidos</option>
                                <option value="EC" selected={checkNationality(userValue.userData.nationality)}>EC - Equador</option>
                                <option value="ER" selected={checkNationality(userValue.userData.nationality)}>ER - Eritréia</option>
                                <option value="SK" selected={checkNationality(userValue.userData.nationality)}>SK - Eslováquia</option>
                                <option value="SI" selected={checkNationality(userValue.userData.nationality)}>SI - Eslovênia</option>
                                <option value="ES" selected={checkNationality(userValue.userData.nationality)}>ES - Espanha</option>
                                <option value="US" selected={checkNationality(userValue.userData.nationality)}>US - Estados Unidos da América</option>
                                <option value="EE" selected={checkNationality(userValue.userData.nationality)}>EE - Estônia</option>
                                <option value="SZ" selected={checkNationality(userValue.userData.nationality)}>SZ - Eswatini</option>
                                <option value="ET" selected={checkNationality(userValue.userData.nationality)}>ET - Etiópia</option>
                                <option value="FJ" selected={checkNationality(userValue.userData.nationality)}>FJ - Fiji</option>
                                <option value="PH" selected={checkNationality(userValue.userData.nationality)}>PH - Filipinas</option>
                                <option value="FI" selected={checkNationality(userValue.userData.nationality)}>FI - Finlândia</option>
                                <option value="FR" selected={checkNationality(userValue.userData.nationality)}>FR - França</option>
                                <option value="GA" selected={checkNationality(userValue.userData.nationality)}>GA - Gabão</option>
                                <option value="GM" selected={checkNationality(userValue.userData.nationality)}>GM - Gâmbia</option>
                                <option value="GH" selected={checkNationality(userValue.userData.nationality)}>GH - Gana</option>
                                <option value="GE" selected={checkNationality(userValue.userData.nationality)}>GE - Geórgia</option>
                                <option value="GD" selected={checkNationality(userValue.userData.nationality)}>GD - Granada</option>
                                <option value="GR" selected={checkNationality(userValue.userData.nationality)}>GR - Grécia</option>
                                <option value="GT" selected={checkNationality(userValue.userData.nationality)}>GT - Guatemala</option>
                                <option value="GY" selected={checkNationality(userValue.userData.nationality)}>GY - Guiana</option>
                                <option value="GN" selected={checkNationality(userValue.userData.nationality)}>GN - Guiné</option>
                                <option value="GQ" selected={checkNationality(userValue.userData.nationality)}>GQ - Guiné Equatorial</option>
                                <option value="GW" selected={checkNationality(userValue.userData.nationality)}>GW - Guiné-Bissau</option>
                                <option value="HT" selected={checkNationality(userValue.userData.nationality)}>HT - Haiti</option>
                                <option value="NL" selected={checkNationality(userValue.userData.nationality)}>NL - Holanda</option>
                                <option value="HN" selected={checkNationality(userValue.userData.nationality)}>HN - Honduras</option>
                                <option value="HU" selected={checkNationality(userValue.userData.nationality)}>HU - Hungria</option>
                                <option value="YE" selected={checkNationality(userValue.userData.nationality)}>YE - Iêmen</option>
                                <option value="MH" selected={checkNationality(userValue.userData.nationality)}>MH - Ilhas Marshall</option>
                                <option value="SB" selected={checkNationality(userValue.userData.nationality)}>SB - Ilhas Salomão</option>
                                <option value="IN" selected={checkNationality(userValue.userData.nationality)}>IN - Índia</option>
                                <option value="ID" selected={checkNationality(userValue.userData.nationality)}>ID - Indonésia</option>
                                <option value="IR" selected={checkNationality(userValue.userData.nationality)}>IR - Irã</option>
                                <option value="IQ" selected={checkNationality(userValue.userData.nationality)}>IQ - Iraque</option>
                                <option value="IE" selected={checkNationality(userValue.userData.nationality)}>IE - Irlanda</option>
                                <option value="IS" selected={checkNationality(userValue.userData.nationality)}>IS - Islândia</option>
                                <option value="IL" selected={checkNationality(userValue.userData.nationality)}>IL - Israel</option>
                                <option value="IT" selected={checkNationality(userValue.userData.nationality)}>IT - Itália</option>
                                <option value="JM" selected={checkNationality(userValue.userData.nationality)}>JM - Jamaica</option>
                                <option value="JP" selected={checkNationality(userValue.userData.nationality)}>JP - Japão</option>
                                <option value="JO" selected={checkNationality(userValue.userData.nationality)}>JO - Jordânia</option>
                                <option value="KI" selected={checkNationality(userValue.userData.nationality)}>KI - Kiribati</option>
                                <option value="KW" selected={checkNationality(userValue.userData.nationality)}>KW - Kuwait</option>
                                <option value="LA" selected={checkNationality(userValue.userData.nationality)}>LA - Laos</option>
                                <option value="LS" selected={checkNationality(userValue.userData.nationality)}>LS - Lesoto</option>
                                <option value="LV" selected={checkNationality(userValue.userData.nationality)}>LV - Letônia</option>
                                <option value="LB" selected={checkNationality(userValue.userData.nationality)}>LB - Líbano</option>
                                <option value="LR" selected={checkNationality(userValue.userData.nationality)}>LR - Libéria</option>
                                <option value="LY" selected={checkNationality(userValue.userData.nationality)}>LY - Líbia</option>
                                <option value="LI" selected={checkNationality(userValue.userData.nationality)}>LI - Liechtenstein</option>
                                <option value="LT" selected={checkNationality(userValue.userData.nationality)}>LT - Lituânia</option>
                                <option value="LU" selected={checkNationality(userValue.userData.nationality)}>LU - Luxemburgo</option>
                                <option value="MK" selected={checkNationality(userValue.userData.nationality)}>MK - Macedônia do Norte</option>
                                <option value="MG" selected={checkNationality(userValue.userData.nationality)}>MG - Madagáscar</option>
                                <option value="MY" selected={checkNationality(userValue.userData.nationality)}>MY - Malásia</option>
                                <option value="MW" selected={checkNationality(userValue.userData.nationality)}>MW - Malauí</option>
                                <option value="MV" selected={checkNationality(userValue.userData.nationality)}>MV - Maldivas</option>
                                <option value="ML" selected={checkNationality(userValue.userData.nationality)}>ML - Mali</option>
                                <option value="MT" selected={checkNationality(userValue.userData.nationality)}>MT - Malta</option>
                                <option value="MA" selected={checkNationality(userValue.userData.nationality)}>MA - Marrocos</option>
                                <option value="MU" selected={checkNationality(userValue.userData.nationality)}>MU - Maurício</option>
                                <option value="MR" selected={checkNationality(userValue.userData.nationality)}>MR - Mauritânia</option>
                                <option value="MX" selected={checkNationality(userValue.userData.nationality)}>MX - México</option>
                                <option value="MM" selected={checkNationality(userValue.userData.nationality)}>MM - Mianmar</option>
                                <option value="FM" selected={checkNationality(userValue.userData.nationality)}>FM - Micronésia</option>
                                <option value="MZ" selected={checkNationality(userValue.userData.nationality)}>MZ - Moçambique</option>
                                <option value="MD" selected={checkNationality(userValue.userData.nationality)}>MD - Moldávia</option>
                                <option value="MC" selected={checkNationality(userValue.userData.nationality)}>MC - Mônaco</option>
                                <option value="MN" selected={checkNationality(userValue.userData.nationality)}>MN - Mongólia</option>
                                <option value="ME" selected={checkNationality(userValue.userData.nationality)}>ME - Montenegro</option>
                                <option value="NA" selected={checkNationality(userValue.userData.nationality)}>NA - Namíbia</option>
                                <option value="NR" selected={checkNationality(userValue.userData.nationality)}>NR - Nauru</option>
                                <option value="NP" selected={checkNationality(userValue.userData.nationality)}>NP - Nepal</option>
                                <option value="NI" selected={checkNationality(userValue.userData.nationality)}>NI - Nicarágua</option>
                                <option value="NE" selected={checkNationality(userValue.userData.nationality)}>NE - Níger</option>
                                <option value="NG" selected={checkNationality(userValue.userData.nationality)}>NG - Nigéria</option>
                                <option value="NO" selected={checkNationality(userValue.userData.nationality)}>NO - Noruega</option>
                                <option value="NZ" selected={checkNationality(userValue.userData.nationality)}>NZ - Nova Zelândia</option>
                                <option value="OM" selected={checkNationality(userValue.userData.nationality)}>OM - Omã</option>
                                <option value="PW" selected={checkNationality(userValue.userData.nationality)}>PW - Palau</option>
                                <option value="PA" selected={checkNationality(userValue.userData.nationality)}>PA - Panamá</option>
                                <option value="PG" selected={checkNationality(userValue.userData.nationality)}>PG - Papua Nova Guiné</option>
                                <option value="PK" selected={checkNationality(userValue.userData.nationality)}>PK - Paquistão</option>
                                <option value="PY" selected={checkNationality(userValue.userData.nationality)}>PY - Paraguai</option>
                                <option value="PE" selected={checkNationality(userValue.userData.nationality)}>PE - Peru</option>
                                <option value="PL" selected={checkNationality(userValue.userData.nationality)}>PL - Polônia</option>
                                <option value="PT" selected={checkNationality(userValue.userData.nationality)}>PT - Portugal</option>
                                <option value="KE" selected={checkNationality(userValue.userData.nationality)}>KE - Quênia</option>
                                <option value="KG" selected={checkNationality(userValue.userData.nationality)}>KG - Quirguistão</option>
                                <option value="GB" selected={checkNationality(userValue.userData.nationality)}>GB - Reino Unido</option>
                                <option value="CF" selected={checkNationality(userValue.userData.nationality)}>CF - República Centro Africana</option>
                                <option value="KR" selected={checkNationality(userValue.userData.nationality)}>KR - República da Coréia</option>
                                <option value="CD" selected={checkNationality(userValue.userData.nationality)}>CD - República Democrática do Congo</option>
                                <option value="DO" selected={checkNationality(userValue.userData.nationality)}>DO - República Dominicana</option>
                                <option value="KP" selected={checkNationality(userValue.userData.nationality)}>KP - República Popular Democrática da Coréia</option>
                                <option value="CZ" selected={checkNationality(userValue.userData.nationality)}>CZ - República Tcheca</option>
                                <option value="RO" selected={checkNationality(userValue.userData.nationality)}>RO - Romênia</option>
                                <option value="RW" selected={checkNationality(userValue.userData.nationality)}>RW - Ruanda</option>
                                <option value="RU" selected={checkNationality(userValue.userData.nationality)}>RU - Rússia (Federação Russa)</option>
                                <option value="WS" selected={checkNationality(userValue.userData.nationality)}>WS - Samoa</option>
                                <option value="SM" selected={checkNationality(userValue.userData.nationality)}>SM - San Marino</option>
                                <option value="LC" selected={checkNationality(userValue.userData.nationality)}>LC - Santa Lúcia</option>
                                <option value="KN" selected={checkNationality(userValue.userData.nationality)}>KN - São Cristóvão e Nevis</option>
                                <option value="ST" selected={checkNationality(userValue.userData.nationality)}>ST - São Tomé e Príncipe</option>
                                <option value="VC" selected={checkNationality(userValue.userData.nationality)}>VC - São Vicente e Granadinas</option>
                                <option value="SC" selected={checkNationality(userValue.userData.nationality)}>SC - Seichelles</option>
                                <option value="SN" selected={checkNationality(userValue.userData.nationality)}>SN - Senegal</option>
                                <option value="SL" selected={checkNationality(userValue.userData.nationality)}>SL - Serra Leoa</option>
                                <option value="RS" selected={checkNationality(userValue.userData.nationality)}>RS - Sérvia</option>
                                <option value="SG" selected={checkNationality(userValue.userData.nationality)}>SG - Singapura</option>
                                <option value="SY" selected={checkNationality(userValue.userData.nationality)}>SY - Síria</option>
                                <option value="SO" selected={checkNationality(userValue.userData.nationality)}>SO - Somália</option>
                                <option value="LK" selected={checkNationality(userValue.userData.nationality)}>LK - Sri Lanka</option>
                                <option value="SD" selected={checkNationality(userValue.userData.nationality)}>SD - Sudão</option>
                                <option value="SS" selected={checkNationality(userValue.userData.nationality)}>SS - Sudão do Sul</option>
                                <option value="SE" selected={checkNationality(userValue.userData.nationality)}>SE - Suécia</option>
                                <option value="CH" selected={checkNationality(userValue.userData.nationality)}>CH - Suíça</option>
                                <option value="SR" selected={checkNationality(userValue.userData.nationality)}>SR - Suriname</option>
                                <option value="TJ" selected={checkNationality(userValue.userData.nationality)}>TJ - Tadjiquistão</option>
                                <option value="TH" selected={checkNationality(userValue.userData.nationality)}>TH - Tailândia</option>
                                <option value="TZ" selected={checkNationality(userValue.userData.nationality)}>TZ - Tanzânia</option>
                                <option value="TL" selected={checkNationality(userValue.userData.nationality)}>TL - Timor Leste</option>
                                <option value="TG" selected={checkNationality(userValue.userData.nationality)}>TG - Togo</option>
                                <option value="TO" selected={checkNationality(userValue.userData.nationality)}>TO - Tonga</option>
                                <option value="TT" selected={checkNationality(userValue.userData.nationality)}>TT - Trinidad e Tobago</option>
                                <option value="TN" selected={checkNationality(userValue.userData.nationality)}>TN - Tunísia</option>
                                <option value="TM" selected={checkNationality(userValue.userData.nationality)}>TM - Turcomenistão</option>
                                <option value="TR" selected={checkNationality(userValue.userData.nationality)}>TR - Turquia</option>
                                <option value="TV" selected={checkNationality(userValue.userData.nationality)}>TV - Tuvalu</option>
                                <option value="UA" selected={checkNationality(userValue.userData.nationality)}>UA - Ucrânia</option>
                                <option value="UG" selected={checkNationality(userValue.userData.nationality)}>UG - Uganda</option>
                                <option value="UY" selected={checkNationality(userValue.userData.nationality)}>UY - Uruguai</option>
                                <option value="UZ" selected={checkNationality(userValue.userData.nationality)}>UZ - Uzbequistão</option>
                                <option value="VU" selected={checkNationality(userValue.userData.nationality)}>VU - Vanuatu</option>
                                <option value="VE" selected={checkNationality(userValue.userData.nationality)}>VE - Venezuela</option>
                                <option value="VN" selected={checkNationality(userValue.userData.nationality)}>VN - Vietnã</option>
                                <option value="ZM" selected={checkNationality(userValue.userData.nationality)}>ZM - Zâmbia</option>
                                <option value="ZW" selected={checkNationality(userValue.userData.nationality)}>ZW - Zimbábue</option>
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
                            <input name="generoPessoal" id="generoPessoal" type="input"  defaultValue={userValue.userData.gender}
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
