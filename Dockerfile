FROM    node:lts-alpine3.23
LABEL   maintainer="Louis Ross <louis.ross@gmail.com"

ARG     MYDIR=/webview
WORKDIR ${MYDIR}

COPY    package*.json ${MYDIR}/
RUN      npm install

COPY    . .
EXPOSE 5173

CMD     ["npm start"]
