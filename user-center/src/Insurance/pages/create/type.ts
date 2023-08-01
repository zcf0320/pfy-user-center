export interface PersonalInfo{
    policyHolderName: string;
    policyHolderIdCard: string;
    policyHolderMobile: string;
    policyHolderEmail: string;
    relationship: number;
    insuredName: string;
    insuredIdCard: string;
    insuredSex: number;
    insuredAge: string;
    jobName: string;
    hasSocialSecurity: boolean;
    insuredMobile: string;
    insuredCodeNumber: string;
    cityId: number;
    provinceName: string;
    cityName: string;
    insuredEmail: string;
    birth: string;
    numberOfInsured: number;
    policyHolderCertificateType: number;
    insuredCertificateType: number;
    policyHolderCodeNumber: string;
    policyHolderBirth: string;
    beneficiaryList: Array<beneficiaryItem>;
    insuredFileList: Array<insuredFileItem>;
    insureQuestionnaire?: any;
    insuredMailingAddress: string;
    policyholderAge: string;
}
interface beneficiaryItem{
    beneficiaryCertificateType: number;
    beneficiaryCodeNumber: string;
    beneficiaryMobile: string;
    beneficiaryName: string;
    benefitRatio: number;
    relationship: number;
}
interface insuredFileItem {
    imgUrls: Array<string>;
    name: string;
    type: number;
}
