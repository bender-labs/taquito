import { ContractAbstraction, ContractProvider, Wallet } from "@taquito/taquito";
import { FetcherProviderInterface, MetadataEnvelope } from "./interfaceFetcherProvider";
import { HTTPHandler } from "./URIHandler/httpHandler";

export class FetcherProvider implements FetcherProviderInterface {
    httpHandler: HTTPHandler;

    constructor() {
        this.httpHandler = new HTTPHandler();
    }
    async fetchMetadata(_contractAbstraction: ContractAbstraction<ContractProvider | Wallet>, _uri: string): Promise<MetadataEnvelope> {
        // tslint:disable-next-line: strict-type-predicates
        if( typeof _contractAbstraction !== 'undefined') {
            console.log(typeof(_contractAbstraction.address))
            const contractAddress: string = _contractAbstraction.address;
        }
        else throw new Error("No contract was passed to the fetcher.");
        
        
        let metadataEnvelope: MetadataEnvelope = {
            uri: _uri,
            metadata: JSON.parse("{}"),
            integrityCheckResult: false,
            // sha256Hash: ""
        };

        const _protocol = this.extractProtocol(_uri);
        
        switch (_protocol) {
            case 'http':
                try {
                    metadataEnvelope.integrityCheckResult = true;
                    metadataEnvelope.metadata = await this.httpHandler.getMetadataHTTP(_uri);
                } catch (error) {
                    throw new Error("Problem using HTTPHandler." + error);
                }
                break;
            case 'https':
                try {
                    metadataEnvelope.integrityCheckResult = true;
                    metadataEnvelope.metadata = await this.httpHandler.getMetadataHTTPS(_uri)
                } catch (error) {
                    throw new Error("Problem using HTTPHandler." + error);
                }
                break;
            default:
                metadataEnvelope.metadata = JSON.parse("{}");
                break;
        }

        return metadataEnvelope;
    }

    /**
     * Returns protocol for a uri, 
     * returns empty string("") if protocol is invalid
     * @param _uri a URI for locating metadata
     */
    private extractProtocol(_uri: string): string {
        // throw new Error("Method not implemented.");
        return 'http';
    }


}