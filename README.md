# PoliFL

PoliFL is a decentralized, edge-based framework for policy-based personal data analytics. It brings together a number of existing established components to provide privacy-preserving analytics within a distributed setting. For more information, please read our ongoing work [Policy-Based Federated Learning](https://arxiv.org/abs/2003.06612).


## Installing and Configuring Databox

You first need to install and configure the Databox platform (https://github.com/me-box/databox).

### Requirements

- Python 3.7+
- Docker

### Install Databox

Git clone [Databox](https://github.com/me-box/databox) into `PoliFL\databox_dev` using `> git clone git@github.com:me-box/databox.git databox_dev`.

Start Databox using:
`> docker run --rm -v /var/run/docker.sock:/var/run/docker.sock --network host -t databoxsystems/databox:0.5.2 /databox start -sslHostName $(hostname)`.

Wait until Databox is loaded and login to http://127.0.0.1 (non https version). Download and install the certificate. Click at "DATABOX DASHBOARD".

Make sure that Databox runs correctly and you can login without any issues (password is random and you can copy it from the terminal).

You can now stop Databox using:
`> docker run --rm -v /var/run/docker.sock:/var/run/docker.sock -t databoxsystems/databox:0.5.2 /databox stop`.

### Install required apps and drivers

Copy `driver-reddit-simulator`, `driver-mobile-phone-use` and `app-ancile` folders (located under `databox`) into `databox_dev\build`.

Under `databox_dev`, run:
- `> ./databox-install-component driver-reddit-simulator databoxsystems 0.5.2`
- `> ./databox-install-component driver-mobile-phone-use databoxsystems 0.5.2`
- `> ./databox-install-component app-ancile databoxsystems 0.5.2`

Start Databox again and go to: `My App -> App Store` and upload the three manifests (`databox-manifest.json`) from `driver-reddit-simulator`, `driver-reddit-simulator`, and `app-ancile` folders. The new driver and app will now appear in the App Store.

Go to the App Store and install `driver-reddit-simulator`. After successfully installed, click at the `driver-reddit-simulator` to see the configuration page (`Reddit Simulator Driver Configuration`), and click at `Save Configuration` to load data from `_davros` account. Do the same for the `driver-mobile-phone-use` to load the sample (`u000.json`).

Full data for Mobile Phone Use dataset can be found at https://crawdad.org/telefonica/mobilephoneuse/20190429/. You need to convert it into json format using the included [converter](tools/csv_to_json.py).

Full data for the Reddit Dataset can be found at: https://drive.google.com/file/d/1yAmEbx7ZCeL45hYj5iEOvNv7k9UoX3vp/view?usp=sharing.

Go to the App Store and install `app-ancile`.

Test that data can be retrieved when visiting:
- https://127.0.0.1/app-ancile/ui/tsblob/latest?data_source_id=redditSimulatorData
- https://127.0.0.1/app-ancile/ui/tsblob/latest?data_source_id=MPUSimulatorData


## Setting up the central node

### Requirements

- rabbitmq-server
- Python 3.7+
- NGINX
- OpenSSH

### Configuring OpenSSH

Make sure your server is accessible over SSH

### Configure RabbitMQ

Create a RabbitMQ user to be able to connect from outside localhost.

```
> sudo rabbitmqctl add_user test test
> sudo rabbitmqctl set_permissions -p / test ".*" ".*" ".*"
```

### Configure NGINX

1. Make sure that the user running the central has read-write accesst to `/var/www/html`.

2. Create a configuration file in `config/config_central.json` with the URL and port of your server.

```
{
	"URL": "",
	"PORT": ""
}
```

### Configure Python environment

1. Clone this repository.

```
git clone https://github.com/minoskt/PoliFL.git
```

2. setup a virtual environment using `venv`.

```
> cd PoliFL
> python -m venv .env
> source .env/bin/activate
> pip install -r requirements.txt
```

3. Add users and policies to `config/users.txt` by using the template in `users_example.txt`. Each line has a username and password separated by a semi-colon.

```
username1;ANYF*
username2;ANYF*
...
```


## Setting up the edge node

### Requirements

- Python 3.7+
- OpenSSH

### Configuring OpenSSH

Setup ssh key-pair with no password and copy it over to the server

```
> ssh-keygen
Generating public/private rsa key pair.
Enter file in which to save the key (/home/mhmd/.ssh/id_rsa):
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /home/mhmd/.ssh/id_rsa
Your public key has been saved in /home/mhmd/.ssh/id_rsa.pub
The key fingerprint is:
SHA256:KRdNDZ9xZgnqJUU/PUy0uxBaJ2C6k7ZFxyb1MseXAeY mhmd@eshmun
The key's randomart image is:
+---[RSA 3072]----+
|          o*==*= |
|         oo+BB*.+|
|        ..+o+EoXo|
|         ++o* B.+|
|      . S=.o . . |
|       o. +   . .|
|         .     . |
|                 |
|                 |
+----[SHA256]-----+

> ssh-copy-id -p 22 username@hostname
```

### Setup python environment

1. Clone this repository.

```
git clone https://github.com/minoskt/PoliFL.git
```

2. Setup a virtual environment using `venv`.

```
> cd PoliFL
> python -m venv .env
> source .env/bin/activate
> pip install -r requirements.txt
```

3. Create a configuration file `config/config_edge.json` based on the provided `config/config_edge_example.json`. The edge node's username is the same one that is associated with the policy. Use the RabbitMQ credentials that you created on the central node.

```
{
	"USERNAME": "",
	"SERVER_URL": "",
	"SSH_USERNAME": "",
	"SSH_PORT": "",
	"RMQ_USERNAME": "",
	"RMQ_PASSWORD": ""
}
```



## Evaluate Edge-Device Overheads

### Requirements

- Affective Norms for English Words (ANEW) Dataset (required file: `ANEW2010All.txt`)
- Reddit Dataset from: https://drive.google.com/file/d/1yAmEbx7ZCeL45hYj5iEOvNv7k9UoX3vp/view?usp=sharing

### Running the evaluations

You can evaluate the three use-cases:
1. Text Filtering Task
2. Language Modeling Task (small)
3. Language Modeling Task (large)

For 1., run `python anew_analyse.py`.
For 2. and 3., run `python ancile/test/test_federated.py`.
To switch the model between `small` and `large`, edit `ancile/lib/federated_helpers/utils/words.yaml`.

For the `large` model, use:
```
emsize: 200
nhid: 200
nlayers: 2
```

For the `small` model, use:
```
emsize: 20
nhid: 20
nlayers: 1
```

After you execute an evaluation script (1., 2. or 3.), copy the reported `Process ID` and use it as an argument in: `bash eval-process.sh <Process ID>`. This script needs to be executed in parallel with the evaluation script.



## Evaluate System Scaling

### On each edge node

To start an edge node, activate the python environment and run `edge.py`.

```
> cd PoliFL
> source .env/bin/activate
> python edge.py
```

### On the central node

Modify `federated.select_users`, `general.sample_data_policy_pairs`, and `federated.average` in `program.py` to match the number of users in `config/users.txt`. Activate the python environment and run `central.py`.

```
> cd PoliFL
> source .env/bin/activate
> python central.py
```


## Acknowledgments

The authors would like to thank Nate Foster, Fred B. Schneider, and Eleanor Birrell for the initial productive discussions and ideas. This work was supported in part by the NSF Grant 1642120. Haddadi and Katevas were partially funded by the EPSRC Databox project EP/N028260/1 and the EPSRC DADA project EP/R03351X/1.


## License

[AGPL License](LICENSE)
