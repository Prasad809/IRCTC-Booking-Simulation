import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import token from "./token";
import { encryptAES, encryptRSA } from "./Encryption";
import Loader from "../libs/Loader"
import { useState } from "react";
import { decryptAES, decryptRSA } from "./Decryption";
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

const headers = {
  'Content-Type': 'application/json'
}
const getCmgpd = () => {
  const responseData = axios.get(`/cmgpd`, { headers: headers }).then(res => {
    let data = res?.data
    token.setPiData(data);
  })
  return responseData;
}
let loginDetls = {};
const generateBearToken = async (rt) => {
  const response = await axios.post(`/tokens`, loginDetls, { headers: { ...headers, rt: rt } });
  return response;
}

const encryptSensitiveData = (data, sensitiveFields, encType) => {
  if (Array.isArray(data)) {
    data.forEach((item, index) => {
      if (item && typeof item === "object") {
        encryptSensitiveData(item, sensitiveFields, encType);
      }
    });
    return;
  }
  if (data && typeof data === "object") {
    Object.keys(data).forEach((key) => {
      const value = data[key];
      if (sensitiveFields.has(key.toLowerCase()) &&
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        if (encType === "AES") {
          data[key] = encryptAES(value);
        } else if (encType === "RSA") {
          data[key] = encryptRSA(value);
        }
        return;
      }
      if (value && typeof value === "object") {
        encryptSensitiveData(value, sensitiveFields, encType);
      }
    });
  }
};

const decryptSensitiveFields = (data,sensitiveFields,encType) => {
    if (data === null ||data === undefined) {
        return data;
    }
    if (Array.isArray(data)) {
        return data.map(item =>
            decryptSensitiveFields(item,sensitiveFields,encType)
        );
    }

    if (typeof data === "object") {
        Object.keys(data).forEach(key => {
            const value = data[key];
            if (value === null || value === undefined || value === "") {
              return;
            }

            if (sensitiveFields.has(key.toLowerCase())) {
                if (encType === "AES") {
                    data[key] = decryptAES(value);
                }else if (encType === "RSA") {
                    data[key] = decryptRSA(value);
                }
                return;
            }

            if (typeof value === "object") {
                data[key] =decryptSensitiveFields(value,sensitiveFields,encType);
            }
        });
    }

    return data;
};

function AxiosMemory({ children }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  getCmgpd();


  
  //request
  useEffect(() => {
    const requestInterceptor = instance.interceptors.request.use(
      async (config) => {
        setLoading(true);
        const rtBtTkns = token.getTokens();
        const rtExpTm = token.getExpryTm();
        let timeNow = Date.now();
        if (rtBtTkns.rt && rtExpTm.btExp <= timeNow) {
          let response = await generateBearToken(rtBtTkns.rt);
          config.headers['rt'] = rtBtTkns.rt;
          config.headers['rt-exp'] = rtExpTm.rtExp;
          config.headers['bt'] = response.headers['bt'];
          config.headers['bt-exp'] = response.headers['bt-exp'];
          token.setTokens({ rt: rtBtTkns.rt, bt: response.headers['bt'] });
          token.setExpryTm({ rtExp: rtExpTm.rtExp, btExp: response.headers['bt-exp'] });
        } else {
          if (rtBtTkns?.bt) config.headers['bt'] = rtBtTkns.bt;
          if (rtBtTkns?.rt) config.headers['rt'] = rtBtTkns.rt;
          if (rtExpTm?.btExp) config.headers['bt-exp'] = rtExpTm.btExp;
          if (rtExpTm?.rtExp) config.headers['rt-exp'] = rtExpTm.rtExp;
        };
        const lookUpDtls = token?.getPiData();
        const encType = lookUpDtls?.encypt;
        const lookUpArray = lookUpDtls?.lookUp || [];
      
        const sensitiveFields = new Set(
          lookUpArray.map(item => item.value.toLowerCase())
        );
        if (config.data && typeof config.data === "object") {
          encryptSensitiveData(config.data, sensitiveFields, encType);
        }
        return config;
      },
      error => {
        setLoading(false);
        Promise.reject(error);
      }
    );

    return () => {
      instance.interceptors.request.eject(requestInterceptor);
    };
  });

  //response
  useEffect(() => {
    const responseInterceptor = instance.interceptors.response.use(
      response => {
        // if (response?.status === 400 || response?.status === 500) {
        //   navigate('/failure');
        // }
        if (response?.status === 500) {
          navigate('/failure');
        }
        const rtTkn = response.headers["rt"] || token.getTokens().rt;
        const btTkn = response.headers["bt"] || token.getTokens().bt;
        const btExp = response.headers["bt-exp"] || token.getExpryTm().btExp;
        const rtExp = response.headers["rt-exp"] || token.getExpryTm().rtExp;
        if (btExp || rtExp) {
          token.setExpryTm({ btExp: btExp, rtExp: rtExp });
        }
        if (rtTkn || btTkn) {
          token.setTokens({ rt: rtTkn, bt: btTkn });
        }
        setLoading(false);
        const lookUpDtls = token?.getPiData();
        const encType = lookUpDtls?.encypt;
        const lookUpArray = lookUpDtls?.lookUp || [];
      
        const sensitiveFields = new Set(
          lookUpArray.map(item => item.value.toLowerCase())
        );
        if (encType && response.data) {
          response.data = decryptSensitiveFields(response.data,sensitiveFields, encType);
        }
        return response;
      },
      error => {
        setLoading(false);
        if (error?.name === "AxiosError") {
          navigate('/failure');
        };
        return Promise.reject(error);
      }
    );
    return () => {
      instance.interceptors.response.eject(responseInterceptor);
    };
  });
  instance.defaults.timeout = 60000;
  if (!loading) {
    <Loader text={"loading...!"} />
  };
  return children;
}

export default instance;
export { AxiosMemory }
