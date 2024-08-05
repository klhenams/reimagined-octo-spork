FROM python:3.11-bullseye

WORKDIR /code

ENV PYTHONUNBUFFERED true
ENV PYTHONDONTWRITEBYTECODE true
ENV PIP_NO_CACHE_DIR true
ENV PIP_DISABLE_PIP_VERSION_CHECK true

ADD --chmod=755 https://astral.sh/uv/install.sh /install.sh
RUN /install.sh && rm /install.sh

COPY requirements.txt /requirements.txt

RUN /root/.cargo/bin/uv pip install --system --no-cache -r /requirements.txt

COPY . /code/

EXPOSE 9002

CMD ["uvicorn", "rms.main:app", "--host", "0.0.0.0", "--port", "9002"]
